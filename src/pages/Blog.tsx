import { BlogPost } from "@/components/BlogPost";

const samplePost = {
  title: "La Prière dans la Vie Quotidienne",
  author: "Marie Dubois",
  date: "2024-02-20",
  image: "/placeholder.svg",
  content: `
    <p>La prière est un aspect fondamental de la vie chrétienne. C'est notre ligne directe de communication avec Dieu, un moment privilégié où nous pouvons nous connecter avec notre Créateur et partager nos joies, nos peines et nos espoirs.</p>
    
    <h2>L'Importance de la Prière Quotidienne</h2>
    <p>Dans notre monde moderne frénétique, il peut être difficile de trouver du temps pour la prière. Cependant, c'est précisément dans ces moments de chaos que nous avons le plus besoin de nous connecter avec Dieu.</p>
    
    <h2>Comment Développer une Vie de Prière</h2>
    <ul>
      <li>Commencez petit : 5-10 minutes par jour</li>
      <li>Choisissez un moment régulier</li>
      <li>Créez un espace dédié</li>
      <li>Utilisez un journal de prière</li>
    </ul>
    
    <blockquote>
      "Priez sans cesse." - 1 Thessaloniciens 5:17
    </blockquote>
    
    <p>La prière n'est pas seulement une discipline spirituelle, c'est un privilège qui nous permet de développer une relation intime avec Dieu.</p>
  `,
};

const Blog = () => {
  return <BlogPost {...samplePost} />;
};

export default Blog;