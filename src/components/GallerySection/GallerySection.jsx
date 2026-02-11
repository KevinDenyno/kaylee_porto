import { useState } from "react";
import { listGallery } from "../../data";
import GalleryModal from "./GalleryModal";

export default function GallerySection() {
  const [activeImage, setActiveImage] = useState(null);

  return (
    <section className="mt-20 py-12">
      <h1 className="text-center text-4xl font-bold mb-2">Gallery</h1>
      <p className="text-center opacity-50 mb-12">
        Moments and experiences captured.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {listGallery.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item.image)}
            className="
              relative cursor-pointer
              rounded-2xl overflow-hidden
              border border-red-900/40
              bg-zinc-900
              group
            "
          >
            <img
              src={item.image}
              loading="lazy"
              className="
                w-full h-60 object-cover
                transition-transform duration-700
                group-hover:scale-110
              "
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        ))}
      </div>

      {/* MODAL */}
      <GalleryModal
        isOpen={!!activeImage}
        image={activeImage}
        onClose={() => setActiveImage(null)}
      />
    </section>
  );
}
