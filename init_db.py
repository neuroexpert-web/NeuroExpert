"""Initialize database with admin user"""
import asyncio
from sqlalchemy.ext.asyncio import AsyncSession
from database import SessionLocal
from models import User
from auth import get_password_hash

async def init_db():
    from sqlalchemy import select
    
    async with SessionLocal() as session:
        try:
            # Проверяем, существует ли админ
            result = await session.execute(
                select(User).where(User.username == "admin")
            )
            admin = result.scalar_one_or_none()
            
            if not admin:
                # Создаем админа
                admin = User(
                    username="admin",
                    email="admin@neuroexpert.ai",
                    full_name="Administrator",
                    hashed_password=get_password_hash("admin123!"),
                    disabled=False
                )
                session.add(admin)
                await session.commit()
                print("Admin user created successfully!")
                print("Username: admin")
                print("Password: admin123!")
            else:
                print("Admin user already exists!")
        except Exception as e:
            print(f"Error initializing database: {e}")
            await session.rollback()
            raise

if __name__ == "__main__":
    asyncio.run(init_db())
