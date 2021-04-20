import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
	Center,
	Box,
	Button,
	FormControl,
	Select,
	Stack,
	Skeleton,
	VStack,
	Tag,
	Link,
	Divider,
	Text
} from '@chakra-ui/react';
import { HiOutlineClipboardCopy } from 'react-icons/hi';
import snoowrap from 'snoowrap';

export const Home = () => {
	const [accessToken, setAccessToken] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [goalSubs, setGoalSubs] = useState([]);
	const [focusColor, setFocusColor] = useState('#A0AEC0');
	const [goalCount, setGoalCount] = useState(0);
	const resultCount = 250;
	const streamArray = ['streamvi', 'streamja', 'streamable', 'streamgg'];

	const getTokens = async () => {
		const tokens = await axios.post('http://localhost:5000/auth/reddit');
		setAccessToken(tokens.data.token);
	};

	const getPosts = async (subreddit) => {
		setIsLoading(true);
		setGoalSubs([]);
		setGoalCount(0);
		const r = await new snoowrap({
			userAgent: 'chrome:joebot goal-getter:v1 (by /u/oopsie)',
			accessToken: accessToken
		});

		if (r) {
			const data = await r
				.getSubreddit(subreddit)
				.getNew({ limit: resultCount });
			console.log(data);

			data.map((post) => {
				if (streamArray.some((v) => post.url.includes(v))) {
					setGoalSubs((array) => [
						...array,
						{
							title: post.title,
							url: post.url,
							id: post.id,
							up: post.ups
						}
					]);
					setGoalCount((prevState) => prevState + 1);
				}
			});
			setIsLoading(false);
		}
	};

	const handleChange = (e) => {
		if (e.target.value === 'Tottenham') {
			getPosts('coys');
			setFocusColor('#2C5282');
		}
		if (e.target.value === 'Arsenal') {
			getPosts('gunners');
			setFocusColor('#E53E3E');
		}
		if (e.target.value === 'Southampton') {
			getPosts('saintsfc');
			setFocusColor('#E53E3E');
		}
		if (e.target.value === 'Manchester City') {
			getPosts('mcfc');
			setFocusColor('#90CDF4');
		}
		if (e.target.value === 'Manchester United') {
			getPosts('reddevils');
			setFocusColor('#C53030');
		}
		if (e.target.value === 'Chelsea') {
			getPosts('chelseafc');
			setFocusColor('#0B46BD');
		}
		if (e.target.value === 'Liverpool') {
			getPosts('liverpoolfc');
			setFocusColor('#E53E3E');
		}
		if (e.target.value === 'r/soccer') {
			getPosts('soccer');
			setFocusColor('#A0AEC0');
		}
	};

	const copyToClipboard = (title, url) => {
		var dummy = document.createElement('textarea');
		// to avoid breaking orgain page when copying more words
		// cant copy when adding below this code
		// dummy.style.display = 'none'
		document.body.appendChild(dummy);
		//Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
		let copystring = `JPB Goal Getter Presents: ${title} ${url}`;
		dummy.value = copystring;
		dummy.select();
		document.execCommand('copy');
		document.body.removeChild(dummy);
	};

	useEffect(() => {
		getTokens();
	}, []);

	return (
		<Center marginBottom='100px'>
			<VStack alignItems='center'>
				<Box marginTop='60px' marginBottom='20px'>
					<Text className='app-title'>JPB Goal Getter</Text>
				</Box>
				<Box>
					<FormControl id='team'>
						<Select
							size='lg'
							width='300px'
							fontSize='22px'
							marginBottom='10px'
							height='75px'
							borderRadius='50px'
							placeholder='Select a subreddit'
							onChange={handleChange}
							focusBorderColor={focusColor}
						>
							<option>Arsenal</option>
							<option>Chelsea</option>
							<option>Liverpool</option>
							<option>Manchester City</option>
							<option>Manchester United</option>
							<option>Tottenham</option>
							<option>Southampton</option>
							<option>r/soccer</option>
						</Select>
					</FormControl>
				</Box>
				<Box marginTop='20px' marginBottom='20px'>
					<Text className='goal-sub-count'>
						Showing {goalCount} possible {goalCount === 1 ? 'goal' : 'goals'}{' '}
						out of {resultCount} new submissions
					</Text>
				</Box>
				{isLoading ? (
					<Center width='60%'>
						<Box marginTop='60px'>
							<Stack>
								<Skeleton height='30px' width='700px' />
								<Skeleton height='30px' width='700px' />
								<Skeleton height='30px' width='700px' />
								<Skeleton height='30px' width='700px' />
								<Skeleton height='30px' width='700px' />
							</Stack>
						</Box>
					</Center>
				) : (
					<Center width='70%'>
						<VStack>
							<Box marginTop='60px'>
								{goalSubs.map((t) => (
									<Box marginBottom='40px' key={t.id}>
										<Box marginBottom='10px'>
											<Text className='goal-sub-count' color={focusColor}>
												This post has <Tag>{t.up}</Tag> upvotes
											</Text>
										</Box>
										<Box>
											<Link
												_hover={{ color: focusColor }}
												href={t.url}
												className='goal-subs'
												isExternal='true'
											>
												{t.title}
											</Link>
										</Box>
										<Box marginTop='5px'>
											<Button
												bg={focusColor}
												color='white'
												borderRadius='70px'
												height='50px'
												width='150px'
												fontFamily='soleil'
												rightIcon={<HiOutlineClipboardCopy color='white' />}
												className='copy-button'
												onClick={copyToClipboard(t.title, t.url)}
											>
												Copy URL
											</Button>
										</Box>
										<Divider marginTop='40px' />
									</Box>
								))}
							</Box>
						</VStack>
					</Center>
				)}
			</VStack>
		</Center>
	);
};
