import bcrypt from 'bcrypt'

export class BCryptService {
  getEncryptedPassword (password: string): string {
    const hash = bcrypt.hashSync(password, 11)

    return hash.replace('$2b$', '$2a$')
  }

  compareStrings (plain: string, hash: string): boolean {
    return !!bcrypt.compareSync(plain, hash)
  }
}
