/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   init.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/06/08 19:16:10 by mbastard          #+#    #+#             */
/*   Updated: 2022/07/06 21:30:33 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/philo.h"

static void	init_rules(t_scene *scene, int argc, char **argv);
static void	init_waitlist(t_scene *scene);
static void	init_table(t_scene *scene);

void	init_scene(t_scene *scene, int argc, char **argv)
{
	init_rules(scene, argc, argv);
	if (scene->rules[0] > 1)
	{
		init_waitlist(scene);
		init_table(scene);
	}
	timer();
}

static void	init_rules(t_scene *scene, int argc, char **argv)
{
	size_t	i;

	i = -1;
	scene->rules = (size_t *)ft_calloc(5, sizeof(size_t));
	scene->rules[4] = -1;
	while (++i < (size_t)argc - 1)
		scene->rules[i] = ft_atoi(argv[i + 1]);
}

static void	init_waitlist(t_scene *scene)
{
	size_t	i;
	size_t	id;

	i = 0;
	id = 1;
	pthread_mutex_init(&scene->waitlist_mutex, NULL);
	scene->waitlist = (size_t *)ft_calloc(scene->rules[0], sizeof(size_t));
	while (i < scene->rules[0] / 2 + scene->rules[0] % 2)
	{
		scene->waitlist[i++] = id;
		id += 2;
	}
	id = 2;
	while (i < scene->rules[0])
	{
		scene->waitlist[i++] = id;
		id += 2;
	}
}

static void	init_table(t_scene *scene)
{
	size_t	i;

	i = -1;
	scene->table = (t_place *)ft_calloc(scene->rules[0], sizeof(t_place));
	while (++i < scene->rules[0])
	{
		scene->table[i].fork = 1;
		scene->table[i].state = 1;
		scene->table[i].last_meal = 0;
		scene->table[i].id = i + 1;
		pthread_mutex_init(&scene->table[i].fork_mutex, NULL);
		pthread_mutex_init(&scene->table[i].state_mutex, NULL);
		if (i + 1 == scene->rules[0])
			scene->table[i].next = scene->table;
		else
			scene->table[i].next = &scene->table[i + 1];
		usleep(100000);
		pthread_create(&scene->table[i].philo, NULL, &exist, scene);
	}
}
