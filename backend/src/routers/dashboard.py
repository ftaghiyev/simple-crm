from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import datetime, timedelta
from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

@router.get("", response_model=schemas.DashboardStats)
def get_dashboard(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    total_leads = db.query(models.Lead).filter(
        models.Lead.owner_id == current_user.id,
        models.Lead.is_active == True
    ).count()

    start_of_week = datetime.utcnow() - timedelta(days=datetime.utcnow().weekday())
    new_leads_this_week = db.query(models.Lead).filter(
        models.Lead.owner_id == current_user.id,
        models.Lead.is_active == True,
        models.Lead.created_at >= start_of_week
    ).count()

    now = datetime.utcnow()
    closed_leads_this_month = db.query(models.Lead).filter(
        models.Lead.owner_id == current_user.id,
        models.Lead.is_active == True,
        models.Lead.status == "closed",
        extract("month", models.Lead.updated_at) == now.month,
        extract("year", models.Lead.updated_at) == now.year
    ).count()

    total_activities = db.query(models.Activity).join(models.Lead).filter(
        models.Lead.owner_id == current_user.id
    ).count()

    status_counts = (
        db.query(models.Lead.status, func.count(models.Lead.id))
        .filter(models.Lead.owner_id == current_user.id, models.Lead.is_active == True)
        .group_by(models.Lead.status)
        .all()
    )
    leads_by_status = [{"status": s, "count": c} for s, c in status_counts]

    recent_activities = (
        db.query(models.Activity)
        .join(models.Lead)
        .filter(models.Lead.owner_id == current_user.id)
        .order_by(models.Activity.activity_date.desc())
        .limit(10)
        .all()
    )

    for act in recent_activities:
        user = db.query(models.User).filter(models.User.id == act.user_id).first()
        act.user_name = f"{user.first_name} {user.last_name}" if user else None

    return {
        "total_leads": total_leads,
        "new_leads_this_week": new_leads_this_week,
        "closed_leads_this_month": closed_leads_this_month,
        "total_activities": total_activities,
        "leads_by_status": leads_by_status,
        "recent_activities": recent_activities
    }
