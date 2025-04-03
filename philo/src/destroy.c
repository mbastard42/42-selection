/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   destroy.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/06/23 18:45:17 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 21:28:24 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

void	destroy_scene(t_scene *scene)
{
	size_t	i;

	i = -1;
	if (scene->rules[0] > 1)
	{
		while (++i < scene->rules[0])
		{
			pthread_mutex_destroy(&scene->table[i].fork_mutex);
			pthread_mutex_destroy(&scene->table[i].state_mutex);
		}
		pthread_mutex_destroy(&scene->waitlist_mutex);
		free(scene->waitlist);
		free(scene->table);
	}
	free(scene->rules);
}
