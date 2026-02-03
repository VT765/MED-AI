import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Search } from "lucide-react";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DoctorListCard } from "@/components/DoctorListCard";
import { MOCK_DOCTORS } from "@/lib/mockData";

const COUNTRIES = ["All countries", "Switzerland", "United States", "India", "United Kingdom"];
const PER_PAGE = 9;

export function AppointmentPage() {
  const [country, setCountry] = useState("All countries");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const matchCountry = (d: (typeof MOCK_DOCTORS)[0]) => country === "All countries" || d.country === country;
    const q = search.toLowerCase();
    const matchSearch = (d: (typeof MOCK_DOCTORS)[0]) =>
      !q || d.name.toLowerCase().includes(q) || d.specialization.toLowerCase().includes(q) || d.country.toLowerCase().includes(q);
    return MOCK_DOCTORS.filter((d) => matchCountry(d) && matchSearch(d));
  }, [country, search]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = useMemo(() => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE), [filtered, page]);

  return (
    <div className="mx-auto max-w-[1440px] space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4">
        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-5 w-5" aria-hidden />
          Back
        </Link>
        <h1 className="text-xl font-bold text-gray-900 lg:text-2xl">Choose Top Doctor</h1>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="sr-only">Select country</label>
          <Select id="country" value={country} onChange={(e) => { setCountry(e.target.value); setPage(1); }} className="w-full rounded-xl border-gray-300 bg-gray-50">
            {COUNTRIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" aria-hidden />
          <Input type="search" placeholder="Enter specialty, sub-specialty or disease" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10 rounded-xl border-gray-300 bg-gray-50" />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginated.map((doctor, i) => (
          <motion.div key={doctor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
            <DoctorListCard doctor={doctor} />
          </motion.div>
        ))}
      </div>

      {paginated.length === 0 && <p className="py-12 text-center text-gray-500">No doctors match your filters.</p>}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50" aria-label="Previous page">‹</button>
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const p = i + 1;
            return (
              <button key={p} type="button" onClick={() => setPage(p)} className={`flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg px-2 ${page === p ? "bg-gray-200 font-semibold text-gray-900" : "border border-gray-300 bg-white text-gray-600 hover:bg-gray-50"}`}>
                {p}
              </button>
            );
          })}
          {totalPages > 5 && (
            <>
              <span className="px-2 text-gray-500">…</span>
              <button type="button" onClick={() => setPage(totalPages)} className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50">{totalPages}</button>
            </>
          )}
          <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50" aria-label="Next page">›</button>
        </div>
      )}
    </div>
  );
}
