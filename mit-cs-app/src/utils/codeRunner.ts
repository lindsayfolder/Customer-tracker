export interface RunResult {
  stdout: string;
  stderr: string;
  error?: string;
}

export interface TestResult {
  passed: boolean;
  description: string;
  expected: string;
  actual: string;
}

const PISTON_API = 'https://emkc.org/api/v2/piston';

const LANGUAGE_MAP: Record<string, { language: string; version: string }> = {
  python: { language: 'python', version: '3.10.0' },
  javascript: { language: 'javascript', version: '18.15.0' },
  c: { language: 'c', version: '10.2.0' },
  java: { language: 'java', version: '15.0.2' },
};

export async function runCode(code: string, language: string, stdin = ''): Promise<RunResult> {
  const lang = LANGUAGE_MAP[language] ?? LANGUAGE_MAP['python'];

  try {
    const response = await fetch(`${PISTON_API}/execute`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ name: 'main', content: code }],
        stdin,
        run_timeout: 5000,
      }),
    });

    if (!response.ok) {
      return { stdout: '', stderr: '', error: `API error: ${response.status}` };
    }

    const data = await response.json();
    return {
      stdout: data.run?.stdout ?? '',
      stderr: data.run?.stderr ?? '',
      error: data.run?.code !== 0 ? data.run?.stderr : undefined,
    };
  } catch (err) {
    return {
      stdout: '',
      stderr: '',
      error: err instanceof Error ? err.message : 'Network error',
    };
  }
}

export function checkTestCases(
  output: string,
  testCases: { expectedOutput: string; description: string }[]
): TestResult[] {
  return testCases.map((tc) => ({
    passed: output.includes(tc.expectedOutput),
    description: tc.description,
    expected: tc.expectedOutput,
    actual: output.trim(),
  }));
}
