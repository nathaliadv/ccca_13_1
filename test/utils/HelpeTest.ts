export default class HelperTest {

    generateRandomValidCPF(): string {
        // Generate a random 9-digit base number
        const baseNumber = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
      
        // Calculate the verification digits (last two digits) for the base number
        const [digit1, digit2] = this.calculateVerificationDigits(baseNumber);
      
        // Combine the base number and the verification digits to create a valid CPF
        const validCPF = [...baseNumber, digit1, digit2].join('');
      
        // Format the CPF with dots and hyphen
        return `${validCPF.substring(0, 3)}.${validCPF.substring(3, 6)}.${validCPF.substring(6, 9)}-${validCPF.substring(9)}`;
    }
      
    private calculateVerificationDigits(digits: number[]): [number, number] {
        const digit1 = this.calculateVerificationDigit(digits, 10);
        const digit2 = this.calculateVerificationDigit([...digits, digit1], 11);
        return [digit1, digit2];
    }
      
    private calculateVerificationDigit(digits: number[], factor: number): number {
        const total = digits.reduce((accumulator, current, index) => {
          return accumulator + current * (factor - index);
        }, 0);
        const remainder = total % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
    
    generateRandomVehiclePlate(): string {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
      
        // Generate three random uppercase letters
        const randomLetters = Array.from({ length: 3 }, () => letters.charAt(Math.floor(Math.random() * letters.length)));
      
        // Generate four random digits
        const randomNumbers = Array.from({ length: 4 }, () => numbers.charAt(Math.floor(Math.random() * numbers.length)));
      
        // Combine the letters and numbers to create the vehicle plate
        const vehiclePlate = randomLetters.join('') + randomNumbers.join('');
      
        return vehiclePlate;
    }
}