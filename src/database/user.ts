import { Sequelize, Model, DataTypes } from 'sequelize';

export default class User extends Model {
	token!: string;
	id!: string;
	permissions!: number;

	get permissions_list() {
		const permissions_list: Permissions[] = [];

		for (const permission in Permissions) {
			// returns both the values we want and the names of each key
			if (isNaN(Number(permission))) {
				continue;
			}

			if ((this.permissions & Number(permission)) == Number(permission)) {
				permissions_list.push(Number(permission));
			}
		}

		return permissions_list;
	}

	get_permissions_list() {
		const permissions_list: Permissions[] = [];

		for (const permission in Permissions) {
			// returns both the values we want and the names of each key
			if (isNaN(Number(permission))) {
				continue;
			}

			if ((this.permissions & Number(permission)) == Number(permission)) {
				permissions_list.push(Number(permission));
			}
		}

		return permissions_list;
	}

	/**
	 * gets permissions with inheritance
	 */
	implied_permissions() {
		const user_permissions_list = this.permissions_list;

		// this is how pointercrate does it (shrug)
		if (user_permissions_list.includes(Permissions.Administrator)) {
			user_permissions_list.push(Permissions.Administrator);
		}

		if (user_permissions_list.includes(Permissions.ListAdministrator)) {
			user_permissions_list.push(Permissions.ListModerator);
		}

		if (user_permissions_list.includes(Permissions.ListModerator)) {
			user_permissions_list.push(Permissions.ListHelper);
		}

		if (user_permissions_list.includes(Permissions.ListHelper)) {
			user_permissions_list.push(Permissions.ExtendedAccess);
		}

		if (user_permissions_list.includes(Permissions.LeaderboardAdministrator)) {
			user_permissions_list.push(Permissions.LeaderboardModerator);
		}

		return user_permissions_list;
	}
}

export enum Permissions {
	ExtendedAccess = 1 << 0,
	ListHelper = 1 << 1,
	ListModerator = 1 << 2,
	ListAdministrator = 1 << 3,
	LeaderboardModerator = 1 << 4,
	LeaderboardAdministrator = 1 << 5,
	Moderator = 1 << 13,
	Administrator = 1 << 14,
	Impossible = 1 << 15,
}

const sequelize = new Sequelize(process.env.DATABASE_URL ?? "sqlite::memory:");

User.init({
	id: {
		type: new DataTypes.STRING(128),
		allowNull: false,
		primaryKey: true,
	},
	token: {
		type: new DataTypes.STRING(128),
		allowNull: false,
	},
	permissions: {
		type: new DataTypes.SMALLINT,
		allowNull: false,
	},
},
	{
		sequelize,
		tableName: "users"
	});

export async function get_user(id: string) {
	return User.findOne({ where: { id } });
}

export async function create_user(id: string, token: string, permissions: number) {
	return User.create({ id, token, permissions });
}

export async function delete_user(id: string) {
	return User.destroy({ where: { id } });
}

export async function test_db() {
	await User.sync();

	return sequelize.authenticate();
}