/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   existence.c                                        :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/04/09 16:59:25 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 21:20:46 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

static void	try_to_eat(t_scene *scene, size_t id);
static void	check_forks(t_scene *scene, int lock, int id);
static void	change_state(t_scene *scene, int new_state, size_t id);
static void	eat(t_scene *scene, size_t id);

void	*exist(void *data)
{
	static size_t	play = 0;
	size_t			id;
	size_t			meal_nb;
	t_scene			*scene;

	scene = (t_scene *)data;
	play++;
	id = play;
	meal_nb = scene->rules[4];
	while (play < scene->rules[0])
		;
	while (play && scene->table[id - 1].state != -1 && meal_nb--)
	{
		try_to_eat(scene, id);
		if (scene->table[id - 1].state == 2)
		{
			change_state(scene, 3, id);
			stop(scene->rules[3]);
			change_state(scene, 1, id);
		}
	}
	if (scene->table[id - 1].state != -1)
		change_state(scene, 4, id);
	play = 0;
	return (NULL);
}

static void	try_to_eat(t_scene *scene, size_t id)
{
	while (scene->table[id - 1].state != -1 && scene->table[id - 1].state != 2)
	{
		pthread_mutex_lock(&scene->waitlist_mutex);
		if (scene->waitlist[0] == id)
		{
			pthread_mutex_unlock(&scene->waitlist_mutex);
			check_forks(scene, 1, id);
			if (scene->table[id - 1].fork && scene->table[id - 1].next->fork)
				eat(scene, id);
			check_forks(scene, 0, id);
		}
		else
			pthread_mutex_unlock(&scene->waitlist_mutex);
		if (timer() > scene->table[id - 1].last_meal + scene->rules[1])
			change_state(scene, -1, id);
		usleep(42);
	}
}

static void	check_forks(t_scene *scene, int lock, int id)
{
	if (lock)
	{
		pthread_mutex_lock(&scene->table[id - 1].fork_mutex);
		pthread_mutex_lock(&scene->table[id - 1].next->fork_mutex);
	}
	else
	{
		pthread_mutex_unlock(&scene->table[id - 1].fork_mutex);
		pthread_mutex_unlock(&scene->table[id - 1].next->fork_mutex);
	}
}

static void	change_state(t_scene *scene, int new_state, size_t id)
{
	pthread_mutex_lock(&scene->table[id - 1].state_mutex);
	scene->table[id - 1].state = new_state;
	pthread_mutex_unlock(&scene->table[id - 1].state_mutex);
}

static void	eat(t_scene *scene, size_t id)
{
	scene->table[id - 1].fork = 0;
	scene->table[id - 1].next->fork = 0;
	check_forks(scene, 0, id);
	change_state(scene, 2, id);
	scene->table[id - 1].last_meal = timer();
	stop(scene->rules[2]);
	check_forks(scene, 1, id);
	scene->table[id - 1].fork = 1;
	scene->table[id - 1].next->fork = 1;
}
