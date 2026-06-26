import { Connection } from "mongoose";

declare global {
    var mongooseConn: {
        conn: Connection | null, //sometime connection done or some time it is connecting or something might be null
        promise: Promise<Connection> | null  //if not connection then connect and give promise is something is happing
    }
}

export {}