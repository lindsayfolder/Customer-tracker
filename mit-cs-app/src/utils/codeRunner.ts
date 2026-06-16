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
}

let compilerCache: Record<string, string> | null = null;

async function getCompilerName(language: string): Promise<string | null> {
  if (!compilerCache) {
    compilerCache = {};
    try {
      const res = await fetch(`${WANDBOX_API}/list.json`);
      if (res.ok) {
        const list: WandboxCompiler[] = await res.json();
        for (const item of list) {
          if (!compilerCache[item.language]) {
            compilerCache[item.language] = item.name;
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

export async function runCode(
  code: string,
  language: string,
  stdin = ''
): Promise<RunResult> {
  try {
    const compiler = await getCompilerName(language);
    if (!compiler) {
      return { stdout: '', stderr: '', error: `Unsupported language: ${language}` };
    }
    const res = await fetch(`${WANDBOX_API}/compile.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler,
        code,
        stdin,
      }),
    });
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      return { stdout: '', stderr: '', error: `API error ${res.status}: ${body}` };
    }
    const data = await res.json();
    const compileError = data.compiler_error ?? '';
    const stdout = data.program_output ?? '';
    const stderr = data.program_error ?? '';
    if (compileError) {
      return { stdout: '', stderr: compileError, error: compileError };
    }
    return { stdout, stderr, error: '' };
  } catch (e: any) {
    return { stdout: '', stderr: '', error: e?.message ?? 'Network error — check your connection' };
  }
}

export function checkTestCases(
  output: string,
  testCases: { expectedOutput: string; description: string }[]
): TestResult[] {
  const lines = output.trim().split('\n');
  return testCases.map((tc, i) => {
    const actual = (lines[i] ?? '').trim();
    const expected = tc.expectedOutput.trim();
    return {
      description: tc.description,
      passed: actual === expected,
      expected,
      actual,
    };
  });
}
