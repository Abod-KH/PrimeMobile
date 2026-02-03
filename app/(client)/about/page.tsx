import Container from "@/components/Container";
import Title from "@/components/Title";

const AboutPage = () => {
  return (
    <Container className="mt-10">
      <Title>About Us</Title>
      <div className="py-10">
        <p className="text-lg leading-relaxed mb-4">
          Welcome to our e-commerce store! We are dedicated to providing you with the best online shopping experience, offering a wide range of high-quality products at competitive prices.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Our mission is to make shopping convenient, enjoyable, and accessible for everyone. We believe in customer satisfaction and strive to exceed your expectations with every purchase.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Founded in [Year], our journey began with a passion for [mention initial inspiration or product type]. Since then, we have grown into a trusted platform, serving thousands of happy customers worldwide.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          At our store, you&apos;ll find everything from [product category 1] to [product category 2], and much more. We carefully curate our collection to ensure that every item meets our strict standards of quality and durability.
        </p>
        <p className="text-lg leading-relaxed mb-4">
          Thank you for choosing us for your shopping needs. We are constantly working to improve our services and expand our product offerings. If you have any questions or feedback, please don&apos;t hesitate to contact us.
        </p>
        <p className="text-lg leading-relaxed">
          Happy Shopping!
        </p>
      </div>
    </Container>
  );
};

export default AboutPage;