from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import models, schemas, security
from ..database import get_db

router = APIRouter(prefix="/api/leads", tags=["Leads"])

@router.post("", response_model=schemas.Lead)
def create_lead(
    lead: schemas.LeadCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    new_lead = models.Lead(
        first_name=lead.first_name,
        last_name=lead.last_name,
        email=lead.email,
        phone=lead.phone,
        status=lead.status,
        source=lead.source,
        budget_min=lead.budget_min,
        budget_max=lead.budget_max,
        property_interest=lead.property_interest,
        owner_id=current_user.id
    )
    db.add(new_lead)
    db.commit()
    db.refresh(new_lead)
    return new_lead


@router.get("", response_model=schemas.PaginatedLeads)
def list_leads(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user),
    search: Optional[str] = Query(None, description="Search by name or email"),
    status: Optional[str] = Query(None, description="Filter by lead status"),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100)
):
    query = db.query(models.Lead).filter(
        models.Lead.is_active == True,
        models.Lead.owner_id == current_user.id
    )

    if search:
        query = query.filter(
            (models.Lead.first_name.ilike(f"%{search}%")) |
            (models.Lead.last_name.ilike(f"%{search}%")) |
            (models.Lead.email.ilike(f"%{search}%"))
        )

    if status:
        query = query.filter(models.Lead.status == status)

    total = query.count()

    skip = (page - 1) * page_size
    leads = query.offset(skip).limit(page_size).all()

    return {
        "results": leads,
        "count": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size
    }


@router.get("/{lead_id}", response_model=schemas.Lead)
def get_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    lead = db.query(models.Lead).filter(
        models.Lead.id == lead_id,
        models.Lead.is_active == True,
        models.Lead.owner_id == current_user.id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")
    return lead


@router.put("/{lead_id}", response_model=schemas.Lead)
def update_lead(
    lead_id: int,
    updated_data: schemas.LeadCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    lead = db.query(models.Lead).filter(
        models.Lead.id == lead_id,
        models.Lead.owner_id == current_user.id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    for key, value in updated_data.dict().items():
        setattr(lead, key, value)
    db.commit()
    db.refresh(lead)
    return lead


@router.delete("/{lead_id}")
def delete_lead(
    lead_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(security.get_current_user)
):
    lead = db.query(models.Lead).filter(
        models.Lead.id == lead_id,
        models.Lead.owner_id == current_user.id
    ).first()
    if not lead:
        raise HTTPException(status_code=404, detail="Lead not found")

    lead.is_active = False
    db.commit()
    return {"detail": "Lead deleted"}
