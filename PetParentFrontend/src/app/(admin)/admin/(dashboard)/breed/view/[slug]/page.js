"use client";
import "../[slug]/page.css";
import { useParams } from "next/navigation";
import { useGetSingleBreedQuery } from "@/apis/adminApi";

export default function BreedDetailPage() {
  const { slug } = useParams();
  const { data, isLoading } = useGetSingleBreedQuery(slug);

  if (isLoading) return <p className="loading">Loading...</p>;

  const breed = data?.data;
  if (!breed) return <p>Breed not found</p>;

  return (
    <div className="breed-detail-wrapper">
      {/* IMAGE */}
      {breed.BreedImage?.url && (
        <div className="detail-image-wrapper">
          <img
            src={breed.BreedImage.url}
            alt={breed.name}
            className="detail-image"
          />
        </div>
      )}

      <h1 className="detail-title">{breed.name}</h1>
      <p className="detail-excerpt">{breed.excerpt}</p>

      <div className="detail-box">
        <p>
          <strong>Size:</strong> {breed.size}
        </p>
        <p>
          <strong>Energy:</strong> {breed.energy}
        </p>
        <p>
          <strong>Good With:</strong> {breed.goodwith?.join(", ")}
        </p>
        <p>
          <strong>Not Ideal For:</strong> {breed.notidealfor?.join(", ")}
        </p>
        <p>
          <strong>Life Expectancy:</strong> {breed.details?.lifeExpectancy}
        </p>
        <p>
          <strong>Temperament:</strong>{" "}
          {breed.details?.temperamentTraits?.join(", ")}
        </p>
      </div>

      <div className="detail-section">
        <h3>About</h3>
        <p>{breed.details?.about}</p>
      </div>

      <div className="detail-section">
        <h3>Nutrition</h3>
        {breed.details?.nutritionDiet?.map((item, i) => (
          <p key={i}>
            <strong>{item.title}:</strong> {item.body}
          </p>
        ))}
        {breed.details?.nutritionNote && (
          <p className="note">
            <strong>Note:</strong> {breed.details.nutritionNote}
          </p>
        )}
      </div>

      <div className="detail-section">
        <h3>Training & Exercise</h3>
        {breed.details?.trainingExercise?.map((item, i) => (
          <p key={i}>
            <strong>{item.title}:</strong> {item.body}
          </p>
        ))}
      </div>
    </div>
  );
}
