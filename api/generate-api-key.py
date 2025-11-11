import sys
import uuid
from sqlalchemy import select
from sqlalchemy.orm import Session
from db.connection import engine
from db.tables import APIKey


def main():

    # Take purpose from command line arguments
    # Purpose can have spaces, so join all args except the first
    # Default purpose is "bot"
    purpose = " ".join(sys.argv[1:]) if len(sys.argv) > 1 else "bot"

    with Session(engine) as session:

        api_key = session.scalar(select(APIKey).where(APIKey.purpose == purpose))

        refreshed: bool = True

        if not api_key:
            # Create a new API key entry if it doesn't exist for that purpose
            api_key = APIKey(purpose=purpose)
            session.add(api_key)
            refreshed = False

        api_key.key = uuid.uuid4()  # Generate a new UUID key
        session.commit()
        session.refresh(api_key)

        if refreshed:
            print(
                f"Refreshed API Key for '{api_key.purpose}', please update the bot client: {api_key.key.hex}"
            )
        else:
            print(f"New API Key for '{api_key.purpose}': {api_key.key.hex}")


if __name__ == "__main__":
    main()
