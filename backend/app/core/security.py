from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _bcrypt_safe(password: str) -> str:
    # bcrypt працює з bytes і має ліміт 72 bytes
    b = password.encode("utf-8")
    if len(b) > 72:
        # краще не мовчки обрізати — хай це буде явна помилка
        raise ValueError("Password too long for bcrypt (max 72 bytes).")
    return password

def hash_password(password: str) -> str:
    password = _bcrypt_safe(password)
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    password = _bcrypt_safe(password)
    return pwd_context.verify(password, password_hash)
