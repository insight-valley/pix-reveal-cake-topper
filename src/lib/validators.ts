/**
 * Validação de documentos (CPF/CNPJ)
 */

/**
 * Valida CPF usando algoritmo oficial
 */
export function validateCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/\D/g, "");

  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;

  // Validação dos dígitos verificadores
  let sum = 0;
  let remainder;

  // Valida primeiro dígito
  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

  // Valida segundo dígito
  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

  return true;
}

/**
 * Valida CNPJ usando algoritmo oficial
 */
export function validateCNPJ(cnpj: string): boolean {
  // Remove caracteres não numéricos
  const cleanCNPJ = cnpj.replace(/\D/g, "");

  // Verifica se tem 14 dígitos
  if (cleanCNPJ.length !== 14) return false;

  // Verifica se todos os dígitos são iguais
  if (/^(\d)\1{13}$/.test(cleanCNPJ)) return false;

  // Validação dos dígitos verificadores
  let length = cleanCNPJ.length - 2;
  let numbers = cleanCNPJ.substring(0, length);
  const digits = cleanCNPJ.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0))) return false;

  length = length + 1;
  numbers = cleanCNPJ.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i)) * pos--;
    if (pos < 2) pos = 9;
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1))) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ
 */
export function validateDocument(
  doc: string,
  type: "CPF" | "CNPJ"
): {
  valid: boolean;
  error?: string;
} {
  const cleanDoc = doc.replace(/\D/g, "");

  if (!cleanDoc) {
    return { valid: false, error: "Documento é obrigatório" };
  }

  if (type === "CPF") {
    if (cleanDoc.length !== 11) {
      return { valid: false, error: "CPF deve ter 11 dígitos" };
    }
    if (!validateCPF(cleanDoc)) {
      return { valid: false, error: "CPF inválido" };
    }
  } else {
    if (cleanDoc.length !== 14) {
      return { valid: false, error: "CNPJ deve ter 14 dígitos" };
    }
    if (!validateCNPJ(cleanDoc)) {
      return { valid: false, error: "CNPJ inválido" };
    }
  }

  return { valid: true };
}

/**
 * Formata CPF: 12345678901 -> 123.456.789-01
 */
export function formatCPF(cpf: string): string {
  const clean = cpf.replace(/\D/g, "");
  return clean.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}

/**
 * Formata CNPJ: 12345678901234 -> 12.345.678/9012-34
 */
export function formatCNPJ(cnpj: string): string {
  const clean = cnpj.replace(/\D/g, "");
  return clean.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
}
