import AccountService from "../src/AccountService";
import RideService from "../src/RideService";
import HelperTest from "./utils/HelpeTest";

const helperTest = new HelperTest();

test("Deve solicitar uma corrida e receber a rideId", async function() {
    const inputSignup = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const accountService = new AccountService();
    const outputSignup = await accountService.signup(inputSignup);
    const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
    const rideService = new RideService();
    const outputRequestRide = await rideService.requestRide(inputRequestRide);
    expect(outputRequestRide.rideId).toBeDefined();
});

test("Caso uma corrida seja solicitada por um passageiro e ele já tenha outra corrida em andamento lançar um erro", async function () {
    const inputSignup = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
	const accountService = new AccountService();
	const outputSignup = await accountService.signup(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const rideService = new RideService();
	await rideService.requestRide(inputRequestRide);
	await expect(() => rideService.requestRide(inputRequestRide)).rejects.toThrow(new Error("This passenger already has an active ride"));
});

test("Caso uma corrida seja solicitada por uma conta que não seja de passageiro deve lançar um erro", async function () {
	const inputSignup: any = {
		name: "Marcos Souza",
		email: `marcos.souza${Math.random()}@gmail.com`,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: helperTest.generateRandomVehiclePlate(),
		isDriver: true
	}
	const accountService = new AccountService();
	const outputSignup = await accountService.signup(inputSignup);
	const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
	const rideService = new RideService();
	await expect(() => rideService.requestRide(inputRequestRide)).rejects.toThrow(new Error("Account is not from a passenger"));
});

test("Deve consultar uma corrida", async function() {
    const inputSignup = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const accountService = new AccountService();
    const outputSignup = await accountService.signup(inputSignup);
    const inputRequestRide = {
		passengerId: outputSignup.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
    const rideService = new RideService();
    const outputRequestRide = await rideService.requestRide(inputRequestRide);
    const outputGetRide = await rideService.getRide(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("requested");
	expect(outputGetRide.passenger_id).toBe(outputSignup.accountId);
	expect(parseFloat(outputGetRide.from_lat)).toBe(inputRequestRide.from.lat);
	expect(parseFloat(outputGetRide.from_long)).toBe(inputRequestRide.from.long);
	expect(parseFloat(outputGetRide.to_lat)).toBe(inputRequestRide.to.lat);
	expect(parseFloat(outputGetRide.to_long)).toBe(inputRequestRide.to.long);
	expect(outputGetRide.date).toBeDefined();
});

test("Deve aceitar uma corrida", async function () {
    const inputSignupPassenger = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const accountService = new AccountService();
    const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
    const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
    const rideService = new RideService();
    const outputRequestRide = await rideService.requestRide(inputRequestRide);

    const inputSignupDriver: any = {
		name: "Marcos Souza",
		email: `marcos.souza${Math.random()}@gmail.com`,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: helperTest.generateRandomVehiclePlate(),
		isDriver: true
	}
	const outputSignupDriver = await accountService.signup(inputSignupDriver);
    const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
    await rideService.acceptRide(inputAcceptRide);
    const outputGetRide = await rideService.getRide(outputRequestRide.rideId);
    expect(outputGetRide.status).toBe("accepted");
    expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId);
});

test("Não deve aceitar uma corrida se a account não for driver", async function () {
    const inputSignupPassenger = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const accountService = new AccountService();
    const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
    const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
    const rideService = new RideService();
    const outputRequestRide = await rideService.requestRide(inputRequestRide);

    const inputSignupDriver: any = {
		name: "Marcos Souza",
		email: `marcos.souza${Math.random()}@gmail.com`,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: helperTest.generateRandomVehiclePlate(),
		isPassenger: true
	}
	const outputSignupDriver = await accountService.signup(inputSignupDriver);
    const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
    await expect(() => rideService.acceptRide(inputAcceptRide)).rejects.toThrow("Account is not from a driver");
});

test("Não deve aceitar uma corrida se o status da corrida não for requested", async function () {
    const inputSignupPassenger = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const accountService = new AccountService();
    const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
    const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}
    const rideService = new RideService();
    const outputRequestRide = await rideService.requestRide(inputRequestRide);

    const inputSignupDriver: any = {
		name: "Marcos Souza",
		email: `marcos.souza${Math.random()}@gmail.com`,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: helperTest.generateRandomVehiclePlate(),
		isDriver: true
	}
	const outputSignupDriver = await accountService.signup(inputSignupDriver);
    const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
    await rideService.acceptRide(inputAcceptRide); //accept ride
    await expect(() => rideService.acceptRide(inputAcceptRide)).rejects.toThrow("The ride is not requested"); //try accept the ride again
});

test("Não deve aceitar uma corrida se o motorista já tiver outra corrida em andamento", async function () {
    const accountService = new AccountService();
    const inputSignupPassenger = {
        name: "João Silva",
        email: `joao.silva${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
    const inputRequestRide = {
		passengerId: outputSignupPassenger.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}

    const inputSignupPassenger2 = {
        name: "Ana Santos",
        email: `ana.santos${Math.random()}@gmail.com`,
        cpf: helperTest.generateRandomValidCPF(),
		isPassenger: true
    }
    const outputSignupPassenger2 = await accountService.signup(inputSignupPassenger2);
    const inputRequestRide2 = {
		passengerId: outputSignupPassenger2.accountId,
		from: {
			lat: -27.584905257808835,
			long: -48.545022195325124
		},
		to: {
			lat: -27.496887588317275,
			long: -48.522234807851476
		}
	}

    const rideService = new RideService();
    const outputRequestRide = await rideService.requestRide(inputRequestRide);
    const outputRequestRide2 = await rideService.requestRide(inputRequestRide2);

    const inputSignupDriver: any = {
		name: "Marcos Souza",
		email: `marcos.souza${Math.random()}@gmail.com`,
		cpf: helperTest.generateRandomValidCPF(),
		carPlate: helperTest.generateRandomVehiclePlate(),
		isDriver: true
	}
	const outputSignupDriver = await accountService.signup(inputSignupDriver);

    const inputAcceptRide = {
		rideId: outputRequestRide.rideId,
		driverId: outputSignupDriver.accountId
	}
    const inputAcceptRide2 = {
		rideId: outputRequestRide2.rideId,
		driverId: outputSignupDriver.accountId
	}
    await rideService.acceptRide(inputAcceptRide);
    console.log(await rideService.getRide(inputAcceptRide.rideId));
    console.log(await rideService.getRide(inputAcceptRide2.rideId));
    await expect(() => rideService.acceptRide(inputAcceptRide2)).rejects.toThrow("Driver is already in another ride");
    console.log(await rideService.getRide(inputAcceptRide2.rideId));
});