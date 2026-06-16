const WANDBOX_API = 'https://wandbox.org/api';

const LANGUAGE_MAP: Record<string, string> = {
  python: 'Python',
  javascript: 'JavaScript',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
};

interface WandboxCompiler {
  name: string;
  language: string;
  version: string;
}

let compilerCache: Record<string, string> | null = null;

async function getCompilerName(language: string): Promise<string | null> {
  if (!compilerCache) {
    compilerCache = {};
    try {
      const res = await fetch(`${WANDBOX_API}/list.json`);
      if (res.ok) {
        const list: WandboxCompiler[] = await res.json();
        // Build language -> newest compiler map
        // Filter for Python 3 specifically, sort to get highest version
        const byLang: Record<string, WandboxCompiler[]> = {};
        for (const item of list) {
          if (!byLang[item.language]) byLang[item.language] = [];
          byLang[item.language].push(item);
        }
        for (const [lang, compilers] of Object.entries(byLang)) {
          // Filter out Python 2, sort descending to get newest first
          const filtered = compilers
            .filter((c) => !(lang === 'Python' && c.name.includes('2.')))
            .sort((a, b) => b.name.localeCompare(a.name));
          if (filtered.length > 0) {
            compilerCache[lang] = filtered[0].name;
          }
        }
      }
    } catch {}
  }
  const wandboxLang = LANGUAGE_MAP[language.toLowerCase()];
  return wandboxLang ? (compilerCache[wandboxLang] ?? null) : null;
}

export interface RunResult {
  stdout: string;
  stderr: string;
  error: string;
}

export interface TestResult {
  description: string;
  passed: boolean;
  expected: string;
  actual: string;
}

function sanitize(code: string): string {
  return code
    .replace(/[""]/g, '"')
    .replace(/['']/g, "'")
    .replace(/[–—]/g, '-');
}

export async function runCode(
  code: string,
  language: string,
  stdin = ''
): Promise<RunResult> {
  try {
    const compiler = await getCompilerName(language);
    code = sanitize(code);
    if (!compiler) {
      return { stdout: '', stderr: '', error: `Unsupported language: ${language}` };
    }
    const res = await fetch(`${WANDBOX_API}/compile.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ compiler, code, stdin }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { stdout: '', stderr: '', error: `API error ${res.status}: ${body}` };
    }
    const data = await res.json();
    const compileError: string = data.compiler_error ?? data.compiler_message ?? '';
    const stdout: string = data.program_output ?? data.output ?? '';
    const stderr: string = data.program_error ?? '';
    if (compileError && !stdout && !stderr) {
      return { stdout: '', stderr: compileError, error: compileError };
    }
    // Combine stdout and any runtime stderr so nothing is hidden
    const combined = [stdout, stderr].filter(Boolean).join('\n');
    return { stdout: combined, stderr, error: '' };
  } catch (e: any) {
    return { stdout: '', stderr: '', error: e?.message ?? 'Network error — check your connection' };
  }
}

export function checkTestCases(
  output: string,
  testCases: { expectedOutput: string; description: string }[]
): TestResult[] {
  const normalizedOutput = output.trim();
  return testCases.map((tc) => {
    const expected = tc.expectedOutput.trim();
    const passed = normalizedOutput.includes(expected);
    return {
      description: tc.description,
      passed,
      expected,
      actual: normalizedOutput,
    };
  });
}
