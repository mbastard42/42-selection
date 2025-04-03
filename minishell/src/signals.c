/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   signals.c                                          :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/19 00:21:26 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 20:15:41 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minishell.h"

static void	control_slash(int sig)
{
	pid_t	pid;
	int		is_kill;

	pid = wait(NULL);
	is_kill = 0;
	while (pid > 0)
	{
		kill(pid, SIGTERM);
		is_kill++;
		pid = wait(NULL);
	}
	if (is_kill)
	{
		write(1, "Quit: 3\n", 9);
		close (0);
	}
	rl_redisplay();
	(void)sig;
}

void	show_ctrl(int hide)
{
	struct termios	new;

	tcgetattr(0, &new);
	if (hide)
		new.c_lflag |= ECHOCTL;
	else
		new.c_lflag &= ~ECHOCTL;
	tcsetattr(0, TCSANOW, &new);
}

void	sig_hand(int sig)
{
	show_ctrl(1);
	if (sig == SIGINT)
	{
		write(1, "\n", 1);
		close(0);
	}
	if (sig == SIGQUIT)
		control_slash(sig);
	show_ctrl(0);
}
