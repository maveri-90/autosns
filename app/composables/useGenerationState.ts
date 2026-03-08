export const useGenerationState = () => {
  const generating = useState('gen-generating', () => false)
  const ideas = useState<any[]>('gen-ideas', () => [])
  const ideasRemaining = useState<number | null>('gen-ideas-remaining', () => null)
  const generatedPost = useState('gen-generated-post', () => '')

  return { generating, ideas, ideasRemaining, generatedPost }
}
