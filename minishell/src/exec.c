/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   exec.c                                             :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: mbastard <mbastard@student.42.fr>          +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2022/10/17 15:41:03 by mbastard          #+#    #+#             */
/*   Updated: 2022/10/24 21:00:10 by mbastard         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

#include "../includes/minishell.h"

int	is_builtin(char *cmd)
{
	if (!ft_strncmp("exit", cmd, 5))
		return (1);
	else if (!ft_strncmp("pwd", cmd, 4))
		return (1);
	else if (!ft_strncmp("echo", cmd, 5))
		return (1);
	else if (!ft_strncmp("cd", cmd, 3))
		return (1);
	else if (!ft_strncmp("export", cmd, 7))
		return (1);
	else if (!ft_strncmp("unset", cmd, 6))
		return (1);
	else if (!ft_strncmp("env", cmd, 4))
		return (1);
	return (0);
}

void	launch_builtin(t_cmd *cmd, t_data *data)
{
	if (!ft_strncmp("env", cmd->argv[0], 4))
		print_tab(data->env);
	else if (!ft_strncmp("exit", cmd->argv[0], 5))
		exiting(data, cmd);
	else if (!ft_strncmp("pwd", cmd->argv[0], 4))
		data->status = pwd(data);
	else if (!ft_strncmp("echo", cmd->argv[0], 5))
		data->status = (echo(cmd->argv));
	else if (!ft_strncmp("cd", cmd->argv[0], 3))
		cd(cmd->argv[1], data);
	else if (!ft_strncmp("export", cmd->argv[0], 7))
		data->status = (export(data, cmd));
	else if (!ft_strncmp("unset", cmd->argv[0], 6))
		data->status = (unset(data, cmd));
}

void	exec_cmd(t_cmd *view, t_data *data)
{
	if (!view->path && is_builtin(view->argv[0]))
		launch_builtin(view, data);
	else if (check_paths(view, data->env))
		execv(view->argv[0], view->argv);
	else
	{
		ft_putsub_fd(data->fd[1], BYEL, '\0');
		ft_putsub_fd(data->fd[1], view->argv[0], '\0');
		ft_putsub_fd(data->fd[1], ": command not found\n" BWHT, 0);
		exit(127);
	}
	exit(0);
}

int	*init_pipe(t_data *data, t_cmd *view, int *old_fd)
{
	int		*new_fd;
	pid_t	pid;

	new_fd = malloc(8);
	pipe(new_fd);
	pid = fork();
	if (!pid)
	{
		if (view->next)
			dup2(new_fd[1], 1);
		if (ft_chainlen(view) != ft_chainlen(data->cmds))
			dup2(old_fd[0], 0);
		open_redirect(view->fd[0], view->fd[1]);
		close_redirect(new_fd[0], new_fd[1]);
		close_redirect(old_fd[0], old_fd[1]);
		exec_cmd(view, data);
		exit (0);
	}
	close_redirect(old_fd[0], old_fd[1]);
	free (old_fd);
	return (new_fd);
}

int	launch_cmds(t_data *data, int *old_fd)
{
	t_cmd	*view;

	view = data->cmds;
	if (view && !view->next && view->argv)
	{
		open_redirect(view->fd[0], view->fd[1]);
		if (view->fd[0] != -1 && view->fd[1] != -1 && is_builtin(view->argv[0]))
			launch_builtin(view, data);
		else if (view->fd[0] != -1 && view->fd[1] != -1 && !fork())
			exec_cmd(view, data);
	}
	else if (view)
	{
		old_fd = malloc(2 * sizeof(int));
		pipe(old_fd);
		while (view)
		{
			if (view->argv)
				old_fd = init_pipe(data, view, old_fd);
			view = view->next;
		}
		close_redirect(old_fd[0], old_fd[1]);
		free(old_fd);
	}
	return (0);
}
