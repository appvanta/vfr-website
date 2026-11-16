import type { Course } from "@/lib/flario";
import { site } from "@/lib/site";

export function CourseJsonLd({ course }: { course: Course }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.title,
    description: course.description,
    provider: {
      "@type": "EducationalOrganization",
      name: site.name,
      sameAs: site.url,
    },
    offers: {
      "@type": "Offer",
      price: (course.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability:
        course.seatsAvailable > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${site.url}/buchung/${course.id}`,
    },
    hasCourseInstance: {
      "@type": "CourseInstance",
      startDate: course.startDate,
      endDate: course.endDate,
      courseMode: "onsite",
      location: {
        "@type": "Place",
        name: site.name,
        address: {
          "@type": "PostalAddress",
          streetAddress: site.address.street,
          postalCode: site.address.zip,
          addressLocality: site.address.city,
          addressCountry: "DE",
        },
      },
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
