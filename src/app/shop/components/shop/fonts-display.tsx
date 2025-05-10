"use client"
import { useState, useEffect } from "react"
import type { ShopItem } from "../../types/shop-types"
import { Button } from "../ui/button"
import supabase from "../../../../../config/supabaseClient"
import { useUuid } from "@/app/writingspace/UUIDContext"
import PurchaseModal from "../shop/purchase-modal" // Import the PurchaseModal component

interface FontCardProps {
  font: ShopItem;
  onPurchase: (item: ShopItem) => void;
  isPurchased: boolean;
}

const FontCard: React.FC<FontCardProps> = ({ font, onPurchase, isPurchased }) => {
  const { font_name, previewUrl, price } = font;
  const fontStyle = font_name?.replace(/\s+/g, "+") || "";

  useEffect(() => {
    const linkTag = document.createElement("link");
    linkTag.href = `https://fonts.googleapis.com/css2?family=${fontStyle}&display=swap`;
    linkTag.rel = "stylesheet";
    document.head.appendChild(linkTag);
    return () => {
      document.head.removeChild(linkTag);
    };
  }, [fontStyle]);

  return (
    <div className="font-card bg-white rounded-lg shadow-md p-4 mb-4">
      <h3 className="text-xl font-semibold mb-2">{font_name}</h3>
      <div className="font-preview mb-2">
        <span
          className="text-lg block"
          style={{ fontFamily: font_name }}
        >
          The quick brown fox jumps over the lazy dog
        </span>
      </div>
      <p className="mt-2">Price: {price} Credits</p>
      <Button
        className={`mt-2 ${isPurchased ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white"}`}
        onClick={() => !isPurchased && onPurchase(font)}
        disabled={isPurchased}
      >
        {isPurchased ? "Purchased" : "Purchase"}
      </Button>
    </div>
  )
}

type FontsDisplayProps = {
  onPurchase: (item: ShopItem) => void;
};

export default function FontsDisplay({ onPurchase }: FontsDisplayProps) {
  const [fonts, setFonts] = useState<ShopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userID } = useUuid();  // Fetch the userID from the UUIDContext
  const [purchasedFontIDs, setPurchasedFontIDs] = useState<string[]>([]);
  const [isUserIDReady, setIsUserIDReady] = useState(false); // Track if userID is ready
  const [isModalOpen, setIsModalOpen] = useState(false); // Track if the confirmation modal is open
  const [selectedFont, setSelectedFont] = useState<ShopItem | null>(null); // Track selected font for purchase confirmation

  // Check if user is logged in
  useEffect(() => {
    if (userID) {
      setIsUserIDReady(true);
    } else {
      setIsUserIDReady(false);
    }
  }, [userID]);  // Trigger whenever userID changes

  useEffect(() => {
    const fetchFonts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from("google_fonts_shop").select("*");
        if (error) throw new Error(error.message);
        setFonts(data || []);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFonts();
  }, []);

  useEffect(() => {
    if (!userID) return;

    const fetchPurchasedFonts = async () => {
      const { data, error } = await supabase
        .from("FontPurchases")
        .select("fontID")
        .eq("userID", userID);

      if (error) {
        console.error("Error fetching purchased fonts:", error.message);
      } else {
        const purchasedIds = data.map(d => d.fontID);
        setPurchasedFontIDs(purchasedIds);
      }
    };

    fetchPurchasedFonts();
  }, [userID]);

  const handlePurchaseClick = (font: ShopItem) => {
    if (!isUserIDReady) {
      console.error("User is not logged in. Cannot process purchase.");
      return;
    }

    if (purchasedFontIDs.includes(font.id)) return;

    // Open the confirmation modal
    setSelectedFont(font);
    setIsModalOpen(true);
  };

  const handlePurchase = async () => {
    if (!selectedFont || !userID) return;

    try {
      const { error } = await supabase.from("FontPurchases").insert([ 
        { userID, fontID: selectedFont.id }
      ]);

      if (error) throw new Error(error.message);

      setPurchasedFontIDs((prev) => [...prev, selectedFont.id]);
      onPurchase(selectedFont);

      setIsModalOpen(false); // Close the modal after successful purchase
    } catch (err: any) {
      console.error("Error processing purchase:", err.message);
    }
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const indexOfLastFont = currentPage * itemsPerPage;
  const indexOfFirstFont = indexOfLastFont - itemsPerPage;
  const currentFonts = fonts.slice(indexOfFirstFont, indexOfLastFont);

  const handlePageClick = (pageNumber: number) => setCurrentPage(pageNumber);
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handleNextPage = () => setCurrentPage(prev => Math.min(prev + 1, totalPages));
  const handlePrevPage = () => setCurrentPage(prev => Math.max(prev - 1, 1));

  const totalPages = Math.ceil(fonts.length / itemsPerPage);

  const pageNumbers: number[] = [];
  for (let i = Math.max(1, currentPage - 3); i <= Math.min(currentPage + 3, totalPages); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers[0] > 1) pageNumbers.unshift(1);
  if (pageNumbers[pageNumbers.length - 1] < totalPages) pageNumbers.push(totalPages);
  if (pageNumbers.length > 7) {
    if (pageNumbers[pageNumbers.length - 1] === totalPages) {
      pageNumbers.splice(0, 1);
    } else {
      pageNumbers.splice(pageNumbers.length - 1, 1);
    }
  }

  if (loading) return <div>Loading fonts...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Custom Fonts</h2>
      <div className="font-list grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {currentFonts.map((font) => (
          <FontCard
            key={font.id}
            font={font}
            onPurchase={handlePurchaseClick} // Open the modal on click
            isPurchased={purchasedFontIDs.includes(font.id)}
          />
        ))}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && selectedFont && (
        <PurchaseModal 
          item={selectedFont}
          onConfirm={handlePurchase}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <div className="pagination flex justify-center items-center mt-6 space-x-2">
        <Button onClick={handleFirstPage} className="px-4 py-2 text-sm rounded bg-gray-300 text-black">{"<<"}</Button>
        <Button onClick={handlePrevPage} className="px-4 py-2 text-sm rounded bg-gray-300 text-black">{"<"}</Button>
        {pageNumbers.map((number) => (
          <Button
            key={number}
            onClick={() => handlePageClick(number)}
            className={`px-4 py-2 text-sm rounded ${currentPage === number ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
          >
            {number}
          </Button>
        ))}
        <Button onClick={handleNextPage} className="px-4 py-2 text-sm rounded bg-gray-300 text-black">{">"}</Button>
        <Button onClick={handleLastPage} className="px-4 py-2 text-sm rounded bg-gray-300 text-black">{">>"}</Button>
      </div>
    </div>
  )
}
