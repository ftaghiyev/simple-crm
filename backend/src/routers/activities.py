from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/leads", tags=["Activities"])

@router.post("/{lead_id}/activities", response_model=schemas.Activity)
def add_activity(
    lead_id: int,
    activity: schemas.ActivityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    lead = db.query(models.Lead).filter(
        models.Lead.id == lead_id,
        models.Lead.owner_id == current_user.id,
        models.Lead.is_active == True
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    new_activity = models.Activity(
        lead_id=lead_id,
        user_id=current_user.id,
        activity_type=activity.activity_type,
        title=activity.title,
        notes=activity.notes,
        duration=activity.duration,
        activity_date=activity.activity_date,
        created_at=datetime.utcnow()
    )
    db.add(new_activity)
    db.commit()
    db.refresh(new_activity)
    return new_activity


@router.get("/{lead_id}/activities", response_model=List[schemas.Activity])
def get_activities(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    lead = db.query(models.Lead).filter(
        models.Lead.id == lead_id,
        models.Lead.owner_id == current_user.id,
        models.Lead.is_active == True
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    activities = (
        db.query(models.Activity)
        .filter(models.Activity.lead_id == lead_id)
        .order_by(models.Activity.activity_date.desc())
        .all()
    )

    for act in activities:
        user = db.query(models.User).filter(models.User.id == act.user_id).first()
        act.user_name = f"{user.first_name} {user.last_name}" if user else None

    return activities
