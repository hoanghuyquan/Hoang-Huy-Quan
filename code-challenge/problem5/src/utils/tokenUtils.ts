import bcrypt from 'bcrypt'
import fse from 'fs-extra'
import jwt from 'jsonwebtoken'
import path from 'path'

const pathFile = path.resolve(__dirname, '../constants')
const privateKey = fse.readFileSync(`${pathFile}/private_key.pem`, 'utf8')
const publicKey = fse.readFileSync(`${pathFile}/public_key.pem`, 'utf8')

export function generateToken(payload: any) {
  try {
    const timestampNow = Math.floor(Date.now() / 1000)
    const token = jwt.sign(
      { ...payload, exp: timestampNow + 60 * 60 * 24 * 1, iat: timestampNow }, // expireIn 1 day
      privateKey,
      {
        algorithm: 'ES512',
      },
    )
    return { error: false, message: '', token: 'Bearer ' + token }
  } catch (error: any) {
    throw {
      error: true,
      message: `Generate token fail: ${error}`,
      status: 401,
    }
  }
}

export function verifyToken(token: string) {
  try {
    const jwtToken = token.startsWith('Bearer ') ? token.slice(7) : token
    const decoded = jwt.verify(jwtToken, publicKey, { algorithms: ['ES512'] })
    return { decoded, error: false, message: '' }
  } catch (error: any) {
    throw {
      error: true,
      message: `Token invalid: ${error}`,
      status: 401,
    }
  }
}

export async function toHashPassword(password: string): Promise<string> {
  const saltOrRounds = await bcrypt.genSalt()
  return await bcrypt.hash(password, saltOrRounds)
}

export async function checkPassword(password: string, passwordHash: string): Promise<boolean> {
  return await bcrypt.compare(password, passwordHash)
}