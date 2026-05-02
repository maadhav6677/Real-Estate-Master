import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Bath,
  BedDouble,
  Bell,
  Building2,
  CalendarClock,
  Car,
  Check,
  ChevronDown,
  ClipboardList,
  Filter,
  Heart,
  Home,
  IndianRupee,
  Layers3,
  MapPin,
  Maximize2,
  MessageCircle,
  Phone,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  TrendingUp,
  UserRoundCheck,
  X
} from "lucide-react";
import "./styles.css";

const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5001/api";

const fallbackProperties = [
  {
    title: "Skyline Crest Penthouse",
    type: "Penthouse",
    status: "For Sale",
    city: "Mumbai",
    neighborhood: "Worli Sea Face",
    price: 74000000,
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
    featured: true,
    furnished: true,
    parking: 3,
    rating: 4.9,
    lat: 19.0169,
    lng: 72.8174,
    tags: ["Sea view", "Private deck", "Concierge"],
    amenities: ["Infinity pool", "Gym", "Smart home"],
    agent: {
      name: "Rhea Kapoor",
      role: "Luxury Homes Advisor",
      phone: "+91 98765 24011",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80"
    },
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "The Grove Family Villa",
    type: "Villa",
    status: "For Sale",
    city: "Bengaluru",
    neighborhood: "Whitefield",
    price: 38500000,
    bedrooms: 5,
    bathrooms: 5,
    area: 5100,
    featured: true,
    furnished: false,
    parking: 4,
    rating: 4.8,
    lat: 12.9698,
    lng: 77.7499,
    tags: ["Garden", "Gated community", "Solar ready"],
    amenities: ["Private lawn", "Home office", "Security"],
    agent: {
      name: "Aarav Mehta",
      role: "Villa Specialist",
      phone: "+91 99887 45120",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80"
    },
    image: "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=1400&q=80"
  },
  {
    title: "Harborline Studio Loft",
    type: "Studio",
    status: "For Rent",
    city: "Pune",
    neighborhood: "Koregaon Park",
    price: 82000,
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    featured: false,
    furnished: true,
    parking: 1,
    rating: 4.6,
    lat: 18.5362,
    lng: 73.8938,
    tags: ["Walkable", "Serviced", "Pet friendly"],
    amenities: ["Rooftop cafe", "Coworking", "Housekeeping"],
    agent: {
      name: "Nisha Rao",
      role: "Rental Consultant",
      phone: "+91 90110 77344",
      avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=256&q=80"
    },
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80"
  }
];

function App() {
  const [properties, setProperties] = useState(fallbackProperties);
  const [activeId, setActiveId] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    city: "All",
    type: "All",
    status: "All",
    minPrice: 0,
    maxPrice: 80000000,
    bedrooms: 0,
    furnished: false,
    featured: false
  });
  const [lead, setLead] = useState({ name: "", phone: "", message: "" });
  const [leadStatus, setLeadStatus] = useState("");

  useEffect(() => {
    fetch(`${apiBase}/properties`)
      .then((response) => response.json())
      .then((data) => {
        if (Array.isArray(data.items) && data.items.length) {
          setProperties(data.items);
          setActiveId(data.items[0]._id || data.items[0].title);
        }
      })
      .catch(() => {
        setActiveId(fallbackProperties[0].title);
      });
  }, []);

  useEffect(() => {
    if (!activeId && properties.length) {
      setActiveId(properties[0]._id || properties[0].title);
    }
  }, [activeId, properties]);

  const cities = useMemo(() => ["All", ...unique(properties.map((property) => property.city))], [properties]);
  const types = useMemo(() => ["All", ...unique(properties.map((property) => property.type))], [properties]);
  const statuses = useMemo(() => ["All", ...unique(properties.map((property) => property.status))], [properties]);

  const filtered = useMemo(() => {
    const search = filters.search.toLowerCase();

    return properties.filter((property) => {
      const text = [property.title, property.city, property.neighborhood, property.type, property.tags?.join(" ")]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        (!search || text.includes(search)) &&
        (filters.city === "All" || property.city === filters.city) &&
        (filters.type === "All" || property.type === filters.type) &&
        (filters.status === "All" || property.status === filters.status) &&
        property.price >= Number(filters.minPrice) &&
        property.price <= Number(filters.maxPrice) &&
        property.bedrooms >= Number(filters.bedrooms) &&
        (!filters.furnished || property.furnished) &&
        (!filters.featured || property.featured)
      );
    });
  }, [filters, properties]);

  const activeProperty = filtered.find((property) => (property._id || property.title) === activeId) || filtered[0] || properties[0];
  const favoriteProperties = properties.filter((property) => favorites.includes(property._id || property.title));

  function updateFilter(name, value) {
    setFilters((current) => ({ ...current, [name]: value }));
  }

  function toggleFavorite(id) {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  async function submitLead(event) {
    event.preventDefault();
    setLeadStatus("Sending inquiry...");

    try {
      const response = await fetch(`${apiBase}/properties/leads`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...lead,
          propertyTitle: activeProperty?.title
        })
      });

      if (!response.ok) {
        throw new Error("Lead request failed");
      }

      setLead({ name: "", phone: "", message: "" });
      setLeadStatus("Inquiry sent to the agent team.");
    } catch {
      setLeadStatus("Inquiry saved locally. Connect the API to send it.");
    }
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#top" aria-label="EstateFlow home">
          <span className="brand-mark">
            <Building2 size={24} />
          </span>
          <span>
            <strong>EstateFlow</strong>
            <small>Client property desk</small>
          </span>
        </a>

        <nav className="nav-list" aria-label="Primary navigation">
          <a className="active" href="#discover">
            <Home size={18} /> Discover
          </a>
          <a href="#pipeline">
            <ClipboardList size={18} /> Agent desk
          </a>
          <a href="#market">
            <TrendingUp size={18} /> Market pulse
          </a>
          <a href="#messages">
            <MessageCircle size={18} /> Messages
          </a>
        </nav>

        <section className="mini-panel">
          <div>
            <small>Monthly target</small>
            <strong>₹18.4Cr</strong>
          </div>
          <div className="progress-bar">
            <span style={{ width: "72%" }} />
          </div>
          <p>72% booked across premium residential inventory.</p>
        </section>
      </aside>

      <section className="workspace" id="top">
        <header className="topbar">
          <div>
            <p className="eyebrow">Real estate portal</p>
            <h1>Find, compare, and close better properties.</h1>
          </div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={18} />
            </button>
            <button className="primary-button">
              <Plus size={18} /> Add listing
            </button>
          </div>
        </header>

        <section className="kpi-grid" aria-label="Portfolio metrics">
          <Metric icon={<Home size={18} />} label="Active listings" value={properties.length} trend="+12%" />
          <Metric icon={<IndianRupee size={18} />} label="Portfolio value" value="₹139Cr" trend="+8.4%" />
          <Metric icon={<UserRoundCheck size={18} />} label="Warm leads" value="84" trend="19 new" />
          <Metric icon={<CalendarClock size={18} />} label="Site visits" value="31" trend="This week" />
        </section>

        <section className="hero-band" id="discover">
          <img src={activeProperty?.image} alt={activeProperty?.title || "Featured property"} />
          <div className="hero-content">
            <span className="pill">
              <Sparkles size={14} /> Featured match
            </span>
            <h2>{activeProperty?.title}</h2>
            <p>
              {activeProperty?.neighborhood}, {activeProperty?.city}
            </p>
            <div className="hero-stats">
              <span>
                <BedDouble size={16} /> {activeProperty?.bedrooms || "Studio"} Beds
              </span>
              <span>
                <Bath size={16} /> {activeProperty?.bathrooms} Baths
              </span>
              <span>
                <Maximize2 size={16} /> {activeProperty?.area?.toLocaleString("en-IN")} sqft
              </span>
            </div>
          </div>
        </section>

        <section className="portal-grid">
          <div className="main-column">
            <Filters
              filters={filters}
              cities={cities}
              types={types}
              statuses={statuses}
              updateFilter={updateFilter}
            />

            <div className="section-heading">
              <div>
                <p className="eyebrow">Inventory</p>
                <h2>{filtered.length} matching listings</h2>
              </div>
              <button className="ghost-button">
                <SlidersHorizontal size={17} /> Sort by fit
              </button>
            </div>

            <div className="listing-grid">
              {filtered.map((property) => {
                const id = property._id || property.title;
                return (
                  <PropertyCard
                    key={id}
                    property={property}
                    active={id === (activeProperty?._id || activeProperty?.title)}
                    favorite={favorites.includes(id)}
                    onSelect={() => setActiveId(id)}
                    onFavorite={() => toggleFavorite(id)}
                  />
                );
              })}
            </div>
          </div>

          <aside className="right-rail">
            <MapPanel properties={filtered} activeProperty={activeProperty} onSelect={setActiveId} />
            <AgentPanel property={activeProperty} lead={lead} setLead={setLead} submitLead={submitLead} status={leadStatus} />
            <Shortlist properties={favoriteProperties} />
          </aside>
        </section>

        <section className="agent-desk" id="pipeline">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Agent tools</p>
              <h2>Pipeline command center</h2>
            </div>
            <button className="ghost-button">
              <Send size={17} /> Share report
            </button>
          </div>
          <div className="pipeline-grid">
            {[
              ["New inquiry", "12", "Respond under 10 min"],
              ["Visit scheduled", "8", "Today and tomorrow"],
              ["Negotiation", "5", "₹21.6Cr in value"],
              ["Closure docs", "3", "Awaiting signatures"]
            ].map(([label, value, note]) => (
              <article className="pipeline-card" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <p>{note}</p>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function Filters({ filters, cities, types, statuses, updateFilter }) {
  return (
    <section className="filters" aria-label="Advanced property filters">
      <label className="search-field">
        <Search size={18} />
        <input
          value={filters.search}
          onChange={(event) => updateFilter("search", event.target.value)}
          placeholder="Search by area, project, amenity"
        />
      </label>

      <SelectFilter label="City" value={filters.city} options={cities} onChange={(value) => updateFilter("city", value)} />
      <SelectFilter label="Type" value={filters.type} options={types} onChange={(value) => updateFilter("type", value)} />
      <SelectFilter label="Status" value={filters.status} options={statuses} onChange={(value) => updateFilter("status", value)} />

      <label className="range-field">
        <span>Max budget</span>
        <input
          type="range"
          min="50000"
          max="80000000"
          step="50000"
          value={filters.maxPrice}
          onChange={(event) => updateFilter("maxPrice", event.target.value)}
        />
        <strong>{formatPrice(filters.maxPrice)}</strong>
      </label>

      <label className="compact-field">
        <BedDouble size={16} />
        <input
          type="number"
          min="0"
          value={filters.bedrooms}
          onChange={(event) => updateFilter("bedrooms", event.target.value)}
          aria-label="Minimum bedrooms"
        />
      </label>

      <button
        className={`toggle-chip ${filters.furnished ? "selected" : ""}`}
        onClick={() => updateFilter("furnished", !filters.furnished)}
      >
        <Check size={15} /> Furnished
      </button>
      <button
        className={`toggle-chip ${filters.featured ? "selected" : ""}`}
        onClick={() => updateFilter("featured", !filters.featured)}
      >
        <Star size={15} /> Featured
      </button>
    </section>
  );
}

function SelectFilter({ label, value, options, onChange }) {
  return (
    <label className="select-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <ChevronDown size={16} />
    </label>
  );
}

function PropertyCard({ property, active, favorite, onSelect, onFavorite }) {
  return (
    <article className={`property-card ${active ? "active" : ""}`} onClick={onSelect}>
      <div className="property-media">
        <img src={property.image} alt={property.title} />
        <span>{property.status}</span>
        <button
          className={`heart-button ${favorite ? "saved" : ""}`}
          onClick={(event) => {
            event.stopPropagation();
            onFavorite();
          }}
          aria-label={favorite ? "Remove from shortlist" : "Add to shortlist"}
        >
          <Heart size={17} fill={favorite ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="property-body">
        <div className="property-title-row">
          <div>
            <h3>{property.title}</h3>
            <p>
              <MapPin size={14} /> {property.neighborhood}, {property.city}
            </p>
          </div>
          <strong>{formatPrice(property.price)}</strong>
        </div>
        <div className="spec-row">
          <span>
            <BedDouble size={15} /> {property.bedrooms || "Studio"}
          </span>
          <span>
            <Bath size={15} /> {property.bathrooms}
          </span>
          <span>
            <Car size={15} /> {property.parking}
          </span>
          <span>
            <Maximize2 size={15} /> {property.area?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="tag-row">
          {property.tags?.slice(0, 3).map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function MapPanel({ properties, activeProperty, onSelect }) {
  const activeId = activeProperty?._id || activeProperty?.title;

  return (
    <section className="map-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Map view</p>
          <h2>Live area scan</h2>
        </div>
        <Filter size={18} />
      </div>
      <div className="map-canvas">
        {properties.map((property, index) => {
          const id = property._id || property.title;
          return (
            <button
              key={id}
              className={`map-pin ${id === activeId ? "active" : ""}`}
              style={{
                left: `${18 + ((index * 23) % 68)}%`,
                top: `${22 + ((index * 31) % 56)}%`
              }}
              onClick={() => onSelect(id)}
              aria-label={`Select ${property.title}`}
            >
              <MapPin size={16} />
              <span>{formatShortPrice(property.price)}</span>
            </button>
          );
        })}
      </div>
      <div className="map-caption">
        <Layers3 size={16} />
        <span>{activeProperty?.neighborhood} demand score: High</span>
      </div>
    </section>
  );
}

function AgentPanel({ property, lead, setLead, submitLead, status }) {
  return (
    <section className="agent-panel" id="messages">
      <div className="agent-card">
        <img src={property?.agent?.avatar} alt={property?.agent?.name || "Agent"} />
        <div>
          <p className="eyebrow">Assigned agent</p>
          <h2>{property?.agent?.name}</h2>
          <span>{property?.agent?.role}</span>
        </div>
      </div>
      <a className="call-link" href={`tel:${property?.agent?.phone}`}>
        <Phone size={17} /> {property?.agent?.phone}
      </a>

      <form className="lead-form" onSubmit={submitLead}>
        <input
          value={lead.name}
          onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))}
          placeholder="Client name"
          required
        />
        <input
          value={lead.phone}
          onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))}
          placeholder="Phone number"
          required
        />
        <textarea
          value={lead.message}
          onChange={(event) => setLead((current) => ({ ...current, message: event.target.value }))}
          placeholder="Requirement notes"
        />
        <button className="primary-button" type="submit">
          <Send size={17} /> Send inquiry
        </button>
        {status && <p className="form-status">{status}</p>}
      </form>
    </section>
  );
}

function Shortlist({ properties }) {
  return (
    <section className="shortlist-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Shortlist</p>
          <h2>{properties.length} saved</h2>
        </div>
        {properties.length ? <Heart size={18} fill="currentColor" /> : <X size={18} />}
      </div>
      {properties.length ? (
        properties.map((property) => (
          <div className="shortlist-item" key={property._id || property.title}>
            <img src={property.image} alt={property.title} />
            <div>
              <strong>{property.title}</strong>
              <span>{formatPrice(property.price)}</span>
            </div>
          </div>
        ))
      ) : (
        <p className="empty-note">Tap the heart on listings to compare client favorites.</p>
      )}
    </section>
  );
}

function Metric({ icon, label, value, trend }) {
  return (
    <article className="metric-card">
      <span>{icon}</span>
      <div>
        <small>{label}</small>
        <strong>{value}</strong>
      </div>
      <em>{trend}</em>
    </article>
  );
}

function formatPrice(value) {
  const price = Number(value);

  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(price % 10000000 ? 1 : 0)}Cr`;
  }

  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(price % 100000 ? 1 : 0)}L`;
  }

  return `₹${price.toLocaleString("en-IN")}`;
}

function formatShortPrice(value) {
  const price = Number(value);
  return price >= 10000000 ? `${Math.round(price / 10000000)}Cr` : `${Math.round(price / 100000)}L`;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

createRoot(document.getElementById("root")).render(<App />);
