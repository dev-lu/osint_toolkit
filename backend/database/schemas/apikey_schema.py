from pydantic import BaseModel


class ApikeySchema(BaseModel):
    name: str
    key: str = ""
    is_active: bool = False


class DeleteApikeyResponse(BaseModel):
    apikey: ApikeySchema
    message: str


class ApikeyStateResponse(BaseModel):
    name: str