/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   time.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/06/08 16:54:28 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 20:43:07 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

size_t	timer(void)
{
	size_t					time;
	static int				launch = 1;
	static struct timeval	s;
	struct timeval			n;

	if (!--launch)
		gettimeofday(&s, NULL);
	gettimeofday(&n, NULL);
	time = (n.tv_sec - s.tv_sec) * 1000;
	time += (n.tv_usec - s.tv_usec) / 1000;
	return (time);
}

void	stop(size_t wait_time)
{
	struct timeval	tv;
	long			end;

	gettimeofday(&tv, NULL);
	end = (tv.tv_sec * 1000 + tv.tv_usec / 1000) + wait_time;
	while (tv.tv_sec * 1000 + tv.tv_usec / 1000 <= end)
	{
		gettimeofday(&tv, NULL);
		usleep(42);
	}
}
