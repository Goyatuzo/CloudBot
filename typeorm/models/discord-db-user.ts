import { Entity, Column, OneToMany, ObjectIdColumn, ObjectID } from "typeorm";
import { GameTime } from "./game-time";

@Entity()
export class DiscordDBUser {
    @ObjectIdColumn()
    id: ObjectID;

    @Column({ type: "char", length: 19 })
    userId: string;

    @Column("varchar")
    username: string;

    @Column({ type: "char", length: 4 })
    discriminator: string;

    @OneToMany(type => GameTime, gameTime => gameTime.discordUser)
    gameTimes: GameTime[];
}
