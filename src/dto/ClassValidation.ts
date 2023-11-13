
import { IsEmail , Length , IsEmpty } from "class-validator";

export class ClassValidation{
    @IsEmail()
    email: string;

    @Length(5, 25)
    password: string;

    @IsEmpty()
    firstname:string

    @IsEmail()
    lastname:string

    @IsEmail()
    company:string
   
}
