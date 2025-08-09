"""Initialize database with admin user"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import SessionLocal
from models import User
from auth import get_password_hash

async def init_db():
    async with SessionLocal() as session:
        # Проверяем, существует ли админ
        admin = await session.query(User).filter(User.username == "admin").first()
        if not admin:
            # Создаем админа
            admin = User(
                username="admin",
                email="admin@example.com",
                full_name="Administrator",
                hashed_password=get_password_hash("admin"),
                disabled=False
            )
            session.add(admin)
            await session.commit()
            print("Admin user created successfully!")
        else:
            print("Admin user already exists!")

if __name__ == "__main__":
    asyncio.run(init_db())
