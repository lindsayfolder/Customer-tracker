const PISTON_API = 'https://emkc.org/api/v2/piston';

const LANGUAGE_ALIASES: Record<string, string[]> = {
  python: ['python', 'python3', 'py'],
  javascript: ['javascript', 'node', 'nodejs', 'node.js', 'js'],
  java: ['java'],
  c: ['c', 'gcc'],
  cpp: ['c++', 'cpp', 'g++'],
};

let runtimeCache: Record<string, string> | null = null;

async function getRuntimes(): Promise<Record<string, string>> {
  if (runtimeCache) return runtimeCache;
  try {
    const res = await fetch(`${PISTON_API}/runtimes`, { method: 'GET' });
    if (!res.ok) return {};
    const data: Array<{ language: string; version: string; aliases: string[] }> = await res.json();
    const map: Record<string, string> = {};
    for (const runtime of data) {
      map[runtime.language.toLowerCase()] = runtime.version;
      for (const alias of runtime.aliases ?? []) {
        map[alias.toLowerCase()] = runtime.version;
      }
    }
    runtimeCache = map;
    return map;
  } catch {
    return {};
  }
}

async function resolveRuntime(language: string): Promise<{ language: string; version: string }> {
  const runtimes = await getRuntimes();
  const aliases = LANGUAGE_ALIASES[language.toLowerCase()] ?? [language.toLowerCase()];
  for (const alias of aliases) {
    if (runtimes[alias]) {
      return { language: alias, version: runtimes[alias] };
    }
  }
  return { language: language.toLowerCase(), version: '0' };
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
    const lang = await resolveRuntime(language);
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ content: code }],
        stdin,
      }),
    });
    if (!response.ok) {
      const body = await response.text().catch(() => '');
      return { stdout: '', stderr: '', error: `API error ${response.status}: ${body}` };
    }
    const data = await response.json();
    const run = data.run ?? {};
    return {
      stdout: run.stdout ?? '',
      stderr: run.stderr ?? '',
      error: run.signal ? `Killed: ${run.signal}` : '',
    };
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
