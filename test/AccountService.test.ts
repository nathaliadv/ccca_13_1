import AccountService from "../src/AccountService";
import HelperTest from "./utils/HelpeTest";

test("Deve criar um passageiro com dados válido", async function() {
    const randomEmail = `joao.silva${Math.random()}@gmail.com`;
    const helperTest = new HelperTest();
    const input = {
        name: "João Silva",
        email: randomEmail,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const accountService = new AccountService();
    const output = await accountService.signup(input);
    const account = await accountService.getAccount(output.accountId);
	expect(account.account_id).toBeDefined();
	expect(account.name).toBe(input.name);
	expect(account.email).toBe(input.email);
	expect(account.cpf).toBe(input.cpf);
});

test("Não deve criar um passageiro com conta existente", async function () {
    const randomEmail = `joao.silva${Math.random()}@gmail.com`;
    const helperTest = new HelperTest();
	const input = {
		name: "João Silva",
		email: randomEmail,
		cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
	}
	const accountService = new AccountService();
    await accountService.signup(input)
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Account already exists"));
});

test("Não deve criar um passageiro com nome inválido", async function () {
    const helperTest = new HelperTest();
	const input = {
		name: "Jo@o",
		email: `joao.silva${Math.random()}@gmail.com`,
		cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid name"));
});

test("Não deve criar um passageiro com email inválido", async function () {
    const helperTest = new HelperTest();
	const input = {
		name: "João Silva",
		email: `joao.silva${Math.random()}gmailcom`,
		cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid email"));
});

test("Não deve criar um passageiro com cpf inválido", async function () {
    const input = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: '958.187.055',
		isPassenger: true
    }
    const accountService = new AccountService();
    await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid cpf"));
});

test("Deve criar um motorista válido", async function () {
    const randomEmail = `marcos.souza${Math.random()}@gmail.com`;
    const helperTest = new HelperTest();
	const input = {
		name: "Marcos Souza",
		email: randomEmail,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: helperTest.generateRandomVehiclePlate(),
		isDriver: true
	}
	const accountService = new AccountService();
	const output = await accountService.signup(input);
	expect(output.accountId).toBeDefined();
});

test("Deve criar um motorista com placa inválida", async function () {
    const randomEmail = `marcos.souza${Math.random()}@gmail.com`;
    const helperTest = new HelperTest();
	const input = {
		name: "Marcos Souza",
		email: randomEmail,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: "AAA999",
		isDriver: true
	}
	const accountService = new AccountService();
	await expect(() => accountService.signup(input)).rejects.toThrow(new Error("Invalid plate"));
});