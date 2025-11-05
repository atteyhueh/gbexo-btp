# Corrections Multimédia - Ajout de Photos et Vidéos aux Projets

## Modifications réalisées

### 1. Composant MultiMediaUpload amélioré
**Fichier** : `src/components/admin/MultiMediaUpload.tsx`

**Nouvelles fonctionnalités** :
- Upload direct de fichiers vers Supabase Storage
- Ajout d'URL externes (vidéos YouTube, photos Pexels, etc.)
- Support complet des vidéos et photos
- Gestion de l'ordre des médias (monter/descendre)
- Marquage des médias en vedette
- Preview des médias avant sauvegarde
- Max 10 fichiers par projet (100MB chacun)

**Utilisation dans l'admin** :
1. Allez dans Projects Manager
2. Créez ou modifiez un projet
3. Section "Médias (Photos/Vidéos)"
4. Glissez/déposez ou cliquez pour ajouter des fichiers
5. Ou cliquez "URL" pour ajouter via lien

### 2. Page de détail du projet améliorée
**Fichier** : `src/pages/ProjectDetail.tsx`

**Affichage** :
- Galerie d'images/vidéos avec navigation
- Miniatures en bas pour sélectionner le média
- Compteur de position (ex: "1 / 5")
- Support des vidéos avec contrôles de lecture
- Layout responsive

### 3. Intégration de la cloche d'annonces
**Fichier** : `src/components/NotificationBell.tsx`

**Correction** :
- Les annonces cliquées naviguent maintenant vers `/announcements/{id}`
- Intégration correcte avec `AnnouncementDetail.tsx`
- Fermeture automatique du dropdown après clic
- Navigation fluide via React Router

### 4. Page de détail des annonces
**Fichier** : `src/pages/AnnouncementDetail.tsx`

**Fonctionnalités** :
- Affichage complet des médias associés
- Galerie avec navigation
- Supports photos et vidéos
- Badge "URGENT" si applicable

## Utilisation

### Ajouter des médias à un projet

**En tant qu'admin** :
1. Accédez à Dashboard > Projets
2. Créez ou modifiez un projet
3. Remplissez "Médias (Photos/Vidéos)"
4. Deux options :
   - **Glisser/déposer** : Sélectionnez fichiers du disque
   - **URL** : Collez lien vidéo ou photo externe

### Format et limites

- **Photos** : JPG, PNG, WebP
- **Vidéos** : MP4, WebM, etc.
- **Taille max** : 100MB par fichier
- **Nombre max** : 10 médias par projet
- **Stockage** : Supabase Storage (CDN global)

### Affichage sur le site public

1. Allez sur la page Projects
2. Cliquez sur un projet
3. Vous verrez :
   - Grand affichage du média actuel
   - Miniatures en bas pour navigation
   - Contrôles vidéo si applicable

### Annonces et notifications

1. Cliquez sur la cloche (haut droit)
2. Voyez la liste des annonces
3. Cliquez "Voir plus →" pour voir le détail
4. Vous accédez à la page AnnouncementDetail avec tous les médias

## Structure des données

### Projet avec médias
```json
{
  "id": 1,
  "title": "Projet ABC",
  "thumbnail_url": "https://...",
  "images": [
    {
      "id": 1,
      "media_type": "image",
      "image_url": "https://...",
      "order_index": 0
    },
    {
      "id": 2,
      "media_type": "video",
      "image_url": "https://...",
      "order_index": 1
    }
  ]
}
```

### Annonce avec médias
```json
{
  "id": 1,
  "title": "Annonce importante",
  "cover_image_url": "https://...",
  "media": [
    {
      "id": 1,
      "media_type": "image",
      "media_url": "https://...",
      "order_index": 0
    }
  ]
}
```

## En cas de problème

### Les médias ne s'affichent pas
1. Vérifiez que `project-images` bucket existe sur Supabase
2. Assurez-vous que le bucket est **public**
3. Vérifiez la console (F12) pour les erreurs
4. Attendez que l'upload soit terminé (icône de chargement)

### Les vidéos ne jouent pas
1. Vérifiez le format (MP4, WebM recommandés)
2. Assurez-vous que l'URL est correctement copiée
3. Testez avec une vidéo de test (Pexels, etc.)

### Upload échoue
1. Vérifiez la taille du fichier (max 100MB)
2. Vérifiez votre connexion internet
3. Attendez quelques secondes avant de réessayer
4. Vérifiez les logs Supabase

## Conseils d'utilisation

### Photos de qualité
- Utilisez Pexels, Unsplash pour des photos gratuites
- Minimum 1920x1080px pour de bons résultats
- Compressez avant d'uploader (TinyPNG, etc.)

### Vidéos
- Hébergez sur YouTube et prenez l'URL
- Ou uploadez directement (MP4 recommandé)
- Durée : max quelques minutes pour performances
- Format 16:9 pour meilleur rendu

### Ordre des médias
- La première est affichée par défaut
- Les visiteurs peuvent naviguer via les miniatures
- Utilisez les flèches (↑↓) en hover pour réorganiser

## Validation

Pour vérifier que tout fonctionne :

1. **Admin** : Créez un projet avec 3 images et 1 vidéo
2. **Site** : Allez sur Projects, cliquez sur votre projet
3. **Galerie** : Naviguez avec les miniatures
4. **Vidéo** : Appuyez sur Play, testez les contrôles
5. **Annonce** : Cliquez cloche → "Voir plus" d'une annonce

Tout doit afficher correctement avec les médias dans le bon ordre.
