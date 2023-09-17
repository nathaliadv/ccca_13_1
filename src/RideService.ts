import AccountService from "./AccountService"
import crypto from "crypto";
import pgp from "pg-promise";

export default class RideService {

    constructor (readonly accountService:AccountService = new AccountService()) {
    }

    async requestRide (input: any) {
        const account = await this.accountService.getAccount(input.passengerId);
        if (!account.is_passenger) throw new Error("Account is not from a passenger");
        const activeRides = await this.getActiveRidesByPassengerId(input.passengerId); 
        if (activeRides && activeRides.length > 0) throw new Error("This passenger already has an active ride");
		const rideId = crypto.randomUUID();
        const ride = {
			rideId,
			passengerId: input.passengerId,
			status: "requested",
			date: new Date(),
			from: {
				lat: input.from.lat,
				long: input.from.long
			},
			to: {
				lat: input.to.lat,
				long: input.to.long
			}
        }
        await this.save(ride);
        return {
            rideId
        };
    }

    async acceptRide (input: any) {
        const account = await this.accountService.getAccount(input.driverId);
        if (account && !account.is_driver) throw new Error("Account is not from a driver");
        const ride = await this.getRide(input.rideId);
        if (!ride) throw new Error("Ride not found");
        if (ride.status !== "requested") throw new Error("The ride is not requested");
        const activeRides = await this.getActiveRidesByDriverId(input.driverId);
        if (activeRides && activeRides.length > 0) throw new Error("Driver is already in another ride");
        ride.rideId = input.rideId;
        ride.driverId = input.driverId;
        ride.status = "accepted";
        await this.update(ride);
    }

    async getRide (rideId: string) {
        const connection = pgp()("postgres://postgres:123456@127.0.0.1:5432/app");
		const [ride] = await connection.query("select * from cccat13.ride where ride_id = $1", [rideId]);
		await connection.$pool.end();
		return ride;
    }

    async getActiveRidesByPassengerId (passengerId: string) {
		const connection = pgp()("postgres://postgres:123456@127.0.0.1:5432/app");
		const rides = await connection.query("select * from cccat13.ride where passenger_id = $1 and status in ('requested', 'accepted', 'in_progress')", [passengerId]);
		await connection.$pool.end();
		return rides;
	}

    async getActiveRidesByDriverId(driverId: string) {
        const connection = pgp()("postgres://postgres:123456@127.0.0.1:5432/app");
		const ride = await connection.query("select * from cccat13.ride where driver_id = $1 and status in ('accepted', 'in_progress')", [driverId]);
		await connection.$pool.end();
		return ride;
    }

    async save (ride: any) {
        const connection = pgp()("postgres://postgres:123456@127.0.0.1:5432/app");
		await connection.query("insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)", [ride.rideId, ride.passengerId, ride.from.lat, ride.from.long, ride.to.lat, ride.to.long, ride.status, ride.date]);
		await connection.$pool.end();
    }

    async update (ride: any) {
        const connection = pgp()("postgres://postgres:123456@127.0.0.1:5432/app");
		await connection.query("update cccat13.ride set driver_id = $1, status = $2 where ride_id = $3", [ride.driverId, ride.status, ride.rideId]);
		await connection.$pool.end();
    }
}