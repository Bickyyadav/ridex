import { Connection } from "mongoose";

declare global {
    var mongooseConn: {
        conn: Connection | null, //sometime connectino done or some time it is connecting
        promise: Promise<Connection> | null  //if not connection then connect and give promise is something is happing
    }
}

export {}