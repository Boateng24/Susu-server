import {IsString, IsNotEmpty, IsEmail} from 'class-validator'

export class userDto {
    @IsString()
    @IsNotEmpty({message: "Fullname is required"})
    fullname: string;

    @IsEmail()
    @IsNotEmpty({message: "Email is required"})
    email: string;

    @IsString()
    @IsNotEmpty({message: "Email is required"})
    password: string;
}