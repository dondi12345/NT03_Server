export class Vector3{
    x : number;
    y : number;
    z : number;

    static New(x : number, y : number, z : number){
        var vec = new Vector3();
        vec.x = x;
        vec.y = y;
        vec.z = z;
        return vec;
    }

    static Minus(v1 : Vector3, v2 : Vector3){
        return Vector3.New(v1.x -v2.x, v1.y -v2.y, v1.z -v2.z)
    }
}