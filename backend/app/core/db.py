from sqlmodel import Session, create_engine, func, select

from app import crud
from app.api.mint_record.mint_record_crud import MintRecordCrud
from app.api.mint_record.mint_record_models import MintRecord, MintRecordCreate
from app.core.config import settings
from app.models import User, UserCreate

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# make sure all SQLModel models are imported (app.models) before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def init_db(session: Session) -> None:
    # Tables should be created with Alembic migrations
    # But if you don't want to use migrations, create
    # the tables un-commenting the next lines
    # from sqlmodel import SQLModel

    # This works because the models are already imported and registered from app.models
    # SQLModel.metadata.create_all(engine)

    mint_record_count = session.exec(select(func.count()).select_from(MintRecord)).one()
    if mint_record_count == 0:
        mint_records = [
            MintRecordCreate(
                user_address="0xEB17Ff2ca29001F1Cdb17490CEF5B0Ec1eB7016a",
                prompt="a smiling cat with sunglasses",
                image_cid="QmeLyxoe4Vp4epxmig4pEaKQbnfPaV5QUebs84AqV9Kx34",
                metadata_uri="ipfs://QmPzS5zjxFjULdsAeHyG7kaL7vUEqKFuuAA94HvcBfyKJR",
                transaction_hash="0x2c47cd5919c2e3b5ce8403f6b3aefe8f9304d586faf8be1e1aaf2c4ceab77211",
                signature="",
            ),
            MintRecordCreate(
                user_address="0xEB17Ff2ca29001F1Cdb17490CEF5B0Ec1eB7016a",
                prompt="a cyberpunk pig",
                image_cid="QmQCcBveW7Y1rjFXZAQZewSamabQRXx7c9AtTwNaADjTqE",
                metadata_uri="ipfs://QmTgZpX8TVtj5jhL6cj5PhGbuuBBENxFtVt977up1makE7",
                transaction_hash="0xc6a64417ec4faaa81dc43eff5489582c0386b0e890453edfbdb1ad21096956ec",
                signature="",
            ),
            MintRecordCreate(
                user_address="0xEB17Ff2ca29001F1Cdb17490CEF5B0Ec1eB7016a",
                prompt="a confused cow with hat",
                image_cid="Qmev1nHR278YmVCe2xBAHvRj3j7YwqXCvMb1GesuJzwZms",
                metadata_uri="ipfs://QmUKPP91YUeMSyppDjGu5e98u5NwfLpzVuTm6jgp7Crx7X",
                transaction_hash="0xde778309f1eea7e08a4214301668a53083710e9b97591b372914d3f73fce8d4d",
                signature="",
            ),
            MintRecordCreate(
                user_address="0xEB17Ff2ca29001F1Cdb17490CEF5B0Ec1eB7016a",
                prompt="an angry bird",
                image_cid="QmSiWFb4KUMrsazBv61ti4DVP6QufLaUwWhURFrqhgZbef",
                metadata_uri="ipfs://QmaTo65t7dqY3RG3vpFkWLmidQMPvt3pbgLtJtjwTbhaCG",
                transaction_hash="0x069d86e9368329e05c6f68f98d28e209c1dc35f01bd629ee6a81d6aa28ab6ea9",
                signature="",
            ),
            MintRecordCreate(
                user_address="0xEB17Ff2ca29001F1Cdb17490CEF5B0Ec1eB7016a",
                prompt="an funny dog with flower",
                image_cid="QmS44LqarZ4Stj4btLonK3UfPUgMHtqPpaknouSe3XdXk4",
                metadata_uri="ipfs://Qmam1ay4kAcBLn8v2J1wq29AoTpf5i2AF4YrsSUakYLWYb",
                transaction_hash="0x4b0eb6f8b92e06749133f3fd7dd299543d4843737975646fb821c56ce972abd8",
                signature="",
            ),
        ]
        for record in mint_records:
            MintRecordCrud(session).create_mint_record(mint_record_create=record)

    user = session.exec(
        select(User).where(User.email == settings.FIRST_SUPERUSER)
    ).first()
    if not user:
        user_in = UserCreate(
            email=settings.FIRST_SUPERUSER,
            password=settings.FIRST_SUPERUSER_PASSWORD,
            is_superuser=True,
        )
        user = crud.create_user(session=session, user_create=user_in)
