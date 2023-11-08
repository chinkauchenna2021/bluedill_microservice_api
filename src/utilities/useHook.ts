import bcrypt from 'bcrypt'

export const generateSalt = async()=>{
   return  await bcrypt.genSalt();
}