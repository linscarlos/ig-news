import { render, screen } from '@testing-library/react'
import Posts, { getStaticProps, Post } from '../../pages/posts';
import { getPrismicClient } from '../../services/prismic'

const posts = [
    { slug: 'my-new-post', 
    title: 'My New Post', 
    excerpt: 'Post excerpt', 
    updateAt: '2020-01-01' }
] as Post[];

jest.mock("../../services/prismic");

describe('Posts page', () => {
    it('renders correctly', () => {
        render(<Posts posts={posts} />)

        expect(screen.getByText('My New Post')).toBeInTheDocument()
    });

    it('loads initial data', async () => {
        const getPrismicClientMocked = jest.mocked(getPrismicClient)

        getPrismicClientMocked.mockReturnValueOnce({
            query: jest.fn().mockResolvedValueOnce({
                results: [
                    {
                        uid: 'my-new-post',
                        data: {
                            title: [
                                { type: 'heading', text: 'My New Post' }
                            ],
                            content: [
                                { type: 'paragraph', text: 'Post excerpt' }
                            ],
                        },
                        last_publication_date: '01-01-2021',
                    }
                ]
            })
        } as any)

        const response = await getStaticProps({
            previewData: undefined,
        })

        expect(response).toEqual(
            expect.objectContaining({
                props: {
                    posts: [{
                        slug: 'my-new-post',
                        title: 'My New Post',
                        excerpt: 'Post excerpt',
                        updateAt: '01 de janeiro de 2021',
                    }]
                }
            })
        )
    })
})