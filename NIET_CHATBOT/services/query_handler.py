import json
import os

# === Load Handbook JSON ===
DATA_PATH = os.path.join(os.path.dirname(__file__), "../data/NIET_Student_Handbook.json")

def load_handbook():
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        return json.load(f)["NIET_Student_Handbook"]


def fetch_data(intent, user_input):
    data = load_handbook()
    user_input = user_input.lower()

    # === FEES HANDLER ===
    if intent == "fees_query":
        fee_data = data["fee_structure"]

        # ---- Academic Fees ----
        if any(word in user_input for word in ["academic", "tuition", "course", "btech"]):
            btech = fee_data["btech"]
            total = btech["total_first_year"]
            discount = btech["discounted_total"]
            return (
                f"Academic Fees (B.Tech 2024–25)"
                f"Total First Year Fee: ₹{total:,}\n"
                f"Discount (One-time payment): ₹{discount:,}\n"
                f"This includes tuition, exam, welfare, and departmental fees."
            )

        # ---- Bus Fees ----
        elif any(word in user_input for word in ["bus", "transport", "route", "conveyance"]):
            bus = fee_data["bus_fee"]
            return (
                "Bus Fees per year:"
                f"• Ghaziabad/Delhi: ₹{bus['ghaziabad_delhi']}\n"
                f"• Noida: ₹{bus['noida']}\n"
                f"• Bulandshahr: ₹{bus['bulandshahr']}\n"
                f"• Sikandrabad: ₹{bus['sikandrabad']}"
            )

        # ---- Hostel Fees ----
        elif "hostel" in user_input:
            hostel = fee_data["hostel_fee"]
            return (
                f"Hostel Fees: ₹{hostel['range']} per annum "
                f"(includes {', '.join(hostel['includes'])})."
            )

        # ---- Clarify ----
        else:
            return "Could you please specify which fees you want details about? (Academic / Bus / Hostel)"


    # === ADMISSION INFO ===
    elif intent == "admission_query":
        ug = data["admission_information"]["undergraduate"]["rules"]
        return "Undergraduate Admission Process:- " + "\n- ".join(ug)


    # === INFRASTRUCTURE HANDLER ===
    elif intent == "infrastructure_query":
        infra = data["infrastructure"]

        if "wifi" in user_input or "internet" in user_input:
            return "Yes, NIET campus is fully Wi-Fi enabled with high-speed internet access in all academic blocks, hostels, and labs."
        elif "library" in user_input:
            lib = infra["library"]
            return (
                f"Library Info:*\nTimings: {lib['timings']}"
                f"Book Limit — UG: {lib['book_limit']['UG']} | PG: {lib['book_limit']['PG']} | Faculty: {lib['book_limit']['Faculty']}\n"
                f"Fine for delay: ₹{lib['fine_per_day']} per day."
            )
        elif "gym" in user_input:
            return " Yes, NIET has a modern gymnasium facility available to students (₹600/month)."
        elif "sports" in user_input:
            return " NIET offers Cricket, Football, Basketball, Badminton, Chess, Yoga, and Carrom facilities."
        else:
            return (
                "Campus Infrastructure Highlights:"
                f"- {infra['campus']}\n"
                "- Library, Gym, Dining Hall, Wi-Fi, Cafeteria, Union Bank & ATM available."
            )


    # === SCHOLARSHIP INFO ===
    elif intent == "scholarship_query":
        sch = data["scholarships"]["links"]
        return (
            "Scholarship Information:"
            f"- UP Government Scholarship: {sch['state_portal']}\n"
            f"- National Scholarship Portal: {sch['national_portal']}\n"
            "Institute verifies documents before forwarding them to authorities."
        )


    # === STUDENT WELFARE ===
    elif intent == "student_welfare_query":
        welfare = data["student_welfare"]
        schemes = welfare["schemes"]
        email = welfare["grievance_cells"]["student_cell"]["email"]

        return (
            "Student Welfare & Development Programs:"
            + "- " + "\n- ".join(schemes)
            + f"\n\nFor grievances, contact SGRC at {email}"
        )


    # === INNOVATION CELL ===
    elif intent == "innovation_query":
        desc = data["innovation_cell"]["description"]
        acts = data["innovation_cell"]["activities"]
        return (
            f"Innovation Council (IIC)\n{desc}\n\nActivities include: "
            + ", ".join(acts)
        )


    # === PLACEMENT / CMC ===
    elif intent == "placement_query":
        placement = data["career_management_cell"]["rules"]
        return "Placement & CMC Rules:*\n- " + "\n- ".join(placement)


    # === CLUBS & ACTIVITIES ===
    elif intent == "club_query":
        clubs = data["clubs_and_activities"]
        return (
            "Student Clubs & Societies:\n"
            "Technical: " + ", ".join(clubs["technical_clubs"]) + "\n"
            "Cultural: " + ", ".join(clubs["cultural_clubs"]) + "\n"
            "Social: " + ", ".join(clubs["social_clubs"]) + "\n"
            "Hobby: " + ", ".join(clubs["hobby_clubs"])
        )


    # === HOSTEL RULES ===
    elif intent == "hostel_query":
        hostel_rules = data["rules_regulations"]["hostel"]
        return "Hostel Rules:- " + "\n- ".join(hostel_rules)


    # === CONTACT INFO ===
    elif intent == "contact_query":
        contacts = data["important_contacts"]
        return (
            " Important Contacts:" +
            "\n".join([f"{c['role']}: {c['name']} ({c['phone']})" for c in contacts])
        )


    # === RULES & CONDUCT ===
    elif intent in ["rules_query", "code_of_conduct_query"]:
        rules = data["rules_regulations"]["campus"]
        return "Campus Discipline Rules:- " + "\n- ".join(rules)


    # === FALLBACK ===
    else:
        return (
            "Sorry, I couldn’t find any information related to that question. "
            "Try asking about fees, Wi-Fi, admission, clubs, or hostel."
        )
