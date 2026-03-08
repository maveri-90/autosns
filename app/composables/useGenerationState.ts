export const useGenerationState = () => {
  const generating = useState('gen-generating', () => false)
  const ideas = useState<any[]>('gen-ideas', () => [])
  const ideasRemaining = useState<number | null>('gen-ideas-remaining', () => null)
  const generatingPost = useState('gen-generating-post', () => false)
  const generatedPost = useState('gen-generated-post', () => '')

  return { generating, ideas, ideasRemaining, generatingPost, generatedPost }
}
