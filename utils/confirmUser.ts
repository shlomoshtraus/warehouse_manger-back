import {usersRepository} from "../data-source";
import {Response} from "express";

export async function confirmUser(userId: string, res: Response) {
    const user = await usersRepository.findOne({where:{id:userId}});
    if (!user) {
        res.status(404).send("Page not found");
        return;
    }
    if (user.confirmed) {
        return res.send("User already confirmed");
    }
    user.confirmed = true;
    await usersRepository.update({id: user.id}, user);
    return res.sendStatus(200);
}