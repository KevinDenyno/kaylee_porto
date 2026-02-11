import { useState } from "react";
import ChromaGrid from "../ChromaGrid/ChromaGrid";
import CertificationModal from "./CertificationModal";
import { listCertification } from "../../data";

export default function CertificationSection() {
  const [selectedCertification, setSelectedCertification] = useState(null);

  const handleCertClick = (cert) => {
    setSelectedCertification(cert);
  };

  const handleCloseModal = () => {
    setSelectedCertification(null);
  };

  return (
    <section className="proyek mt-16 py-10" id="certification">
      <h1 className="text-center text-4xl font-bold mb-2">
        Certification
      </h1>
      <p className="text-center opacity-50">
        Certifications and activities that represent my journey and experience.
      </p>

      <div className="mt-14">
        <ChromaGrid
          items={listCertification}
          onItemClick={handleCertClick}
          radius={500}
          damping={0.45}
          fadeOut={0.6}
          ease="power3.out"
        />
      </div>

      {/* MODAL — SAMA SEPERTI PROJECT */}
      <CertificationModal
        isOpen={!!selectedCertification}
        certification={selectedCertification}
        onClose={handleCloseModal}
      />
    </section>
  );
}
