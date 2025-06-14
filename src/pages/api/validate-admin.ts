// pages/api/validate-admin.ts
export default function handler(
  req: { method: string; body: { password: any } },
  res: {
    status: (arg0: number) => {
      (): any;
      new (): any;
      json: { (arg0: { valid: boolean }): any; new (): any };
      end: { (): void; new (): any };
    };
  }
) {
  if (req.method === "POST") {
    const { password } = req.body;
    const isValid = password === process.env.ADMIN_PASSWORD;

    return res.status(200).json({ valid: isValid });
  }

  res.status(405).end(); // Method Not Allowed
}
