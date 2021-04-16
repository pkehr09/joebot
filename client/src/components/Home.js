import React, { useState } from 'react';
import axios from 'axios';
import {
	Center,
	Box,
	Text,
	FormControl,
	Select,
	Stack,
	Skeleton,
	SkeletonCircle,
	SkeletonText,
	VStack
} from '@chakra-ui/react';

export const Home = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [posts, setPosts] = useState([]);
	const [isError, setIsError] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');

	const s = [
		'coys',
		'gunners',
		'saintsfc',
		'mcfc',
		'reddevils',
		'chelseafc',
		'liverpoolfc'
	];

	const getPosts = async (team, subreddit) => {
		const post = await axios.get(
			`https://api.pushshift.io/reddit/search/submission/?title=${team}&subreddit=soccer,${subreddit}&size=100&fields=title,url,media,subreddit`
		);
		return post;
	};

	const handleRequest = (team, subreddit) => {
		setIsLoading(true);
		setPosts([]);
		const posts = getPosts(team, subreddit).then((post) => {
			console.log(post.data.data);
			post.data.data.map((goal) => {
				setPosts((oldArray) => [...oldArray, goal.title]);
			});
			console.log(posts);
			setIsLoading(false);
		});
	};

	const handleChange = (e) => {
		if (e.target.value === 'Tottenham') {
			handleRequest(e.target.value, s[0]);
		}

		if (e.target.value === 'Arsenal') {
			handleRequest(e.target.value, s[1]);
		}
		if (e.target.value === 'Southampton') {
			handleRequest(e.target.value, s[2]);
		}
		if (e.target.value === 'Manchester City') {
			handleRequest(e.target.value, s[3]);
		}
		if (e.target.value === 'Manchester United') {
			handleRequest(`${e.target.value} utd`, s[4]);
		}
		if (e.target.value === 'Chelsea') {
			handleRequest(e.target.value, s[5]);
		}
		if (e.target.value === 'Liverpool') {
			handleRequest(e.target.value, s[6]);
		}
	};

	const Loading = () => {
		return (
			<Stack>
				<Skeleton height='20px' />
				<Skeleton height='20px' />
				<Skeleton height='20px' />
			</Stack>
		);
	};

	const Posts = ({ title }) => {
		return (
			<Center marginTop='20px'>
				<Text>{title}</Text>
			</Center>
		);
	};
	return (
		<Center>
			<VStack alignItems='center'>
				<Box marginTop='100px' marginBottom='100px'>
					<FormControl id='team'>
						<Select
							size='lg'
							width='400px'
							variant='flushed'
							placeholder='Select team'
							onChange={handleChange}
						>
							<option>Arsenal</option>
							<option>Chelsea</option>
							<option>Liverpool</option>
							<option>Manchester City</option>
							<option>Manchester United</option>
							<option>Tottenham</option>
							<option>Southampton</option>
						</Select>
					</FormControl>
				</Box>

				{isLoading ? (
					<Center>
						<Box>
							<Skeleton
								startColor='pink.500'
								endColor='orange.500'
								height='200px'
							/>
						</Box>
						<Box>
							<Text>Loading...</Text>
						</Box>
					</Center>
				) : (
					<Center>
						<VStack marginBottom='200px'>
							{posts.map((titles) => (
								<Center textAlign='center' width='80%'>
									<Posts title={titles} />
								</Center>
							))}
						</VStack>
					</Center>
				)}
			</VStack>
		</Center>
	);
};
