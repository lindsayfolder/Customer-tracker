const PISTON_API = 'https://emkc.org/api/v2/piston';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '*' },
  javascript: { language: 'javascript', version: '*' },
  java: { language: 'java', version: '*' },
  c: { language: 'c', version: '*' },
  cpp: { language: 'c++', version: '*' },
};

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
  const lang = LANGUAGE_MAP[language.toLowerCase()] ?? { language, version: '*' };
  try {
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
      return { stdout: '', stderr: '', error: `API error: ${response.status}` };
    }
    const data = await response.json();
    const run = data.run ?? {};
    return {
      stdout: run.stdout ?? '',
      stderr: run.stderr ?? '',
      error: run.signal ? `Killed: ${run.signal}` : '',
    };
  } catch (e: any) {
    return { stdout: '', stderr: '', error: e?.message ?? 'Network error' };
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
