// src/lib/auth.ts

export async function signIn(email: string, password: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error("Please enter both email and password."));
      } else {
        // Simulate success
        localStorage.setItem("auth", "true");
        localStorage.setItem("userEmail", email);
        resolve();
      }
    }, 700);
  });
}

export async function signUp(
  email: string,
  password: string,
  confirmPassword: string,
  terms: boolean
): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password || !confirmPassword) {
        reject(new Error("Please fill in all fields."));
      } else if (password !== confirmPassword) {
        reject(new Error("Passwords do not match."));
      } else if (!terms) {
        reject(new Error("You must agree to the terms."));
      } else {
        // Simulate success
        localStorage.setItem("auth", "true");
        localStorage.setItem("userEmail", email);
        resolve();
      }
    }, 900);
  });
} 