import CpfValidator from "../src/CpfValidator"
import HelperTest from "./utils/HelpeTest";

const helperTest = new HelperTest();

test.each([
	"95818705552",
	"01234567890",
	"565.486.780-60",
	"147.864.110-00",
	helperTest.generateRandomValidCPF()
])("Deve validar um cpf", function (cpf: string) {
	const cpfValidator = new CpfValidator();
	expect(cpfValidator.validate(cpf)).toBeTruthy();
});

test.each([
	"958.187.055-00",
	"958.187.055",
	"111.111.111-11"
])("Não deve validar um cpf", function (cpf: string) {
	const cpfValidator = new CpfValidator();
	expect(cpfValidator.validate(cpf)).toBeFalsy();
});